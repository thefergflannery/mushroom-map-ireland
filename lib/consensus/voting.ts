/**
 * Consensus and voting logic for Mushroom Map Ireland
 */

import { Role } from '@prisma/client';

/**
 * Calculate voter weight based on role and reputation
 */
export function calculateVoterWeight(role: Role, reputation: number): number {
  const roleWeights: Record<Role, number> = {
    USER: 1,
    TRUSTED: 2,
    MOD: 3,
    BIOLOGIST: 5,
    ADMIN: 5,
  };
  
  const baseWeight = roleWeights[role] || 1;
  
  // Add reputation bonus (max +2)
  const reputationBonus = Math.min(Math.floor(reputation / 100), 2);
  
  return baseWeight + reputationBonus;
}

/**
 * Calculate identification score from votes
 */
export function calculateIdentificationScore(
  votes: Array<{ value: number; voter: { role: Role; reputation: number } }>
): number {
  return votes.reduce((sum, vote) => {
    const weight = calculateVoterWeight(vote.voter.role, vote.voter.reputation);
    return sum + vote.value * weight;
  }, 0);
}

/**
 * Determine if identification has reached consensus
 */
export function hasReachedConsensus(
  topScore: number,
  runnerUpScore: number,
  threshold: number = 10,
  margin: number = 5
): boolean {
  return topScore >= threshold && topScore - runnerUpScore >= margin;
}

/**
 * Check if user can resolve identification directly (trusted roles)
 */
export function canResolveDirectly(role: Role): boolean {
  return role === 'BIOLOGIST' || role === 'MOD' || role === 'ADMIN';
}

/**
 * Calculate reputation change from vote
 */
export function calculateReputationChange(
  isCorrectIdentification: boolean,
  voterRole: Role
): number {
  if (isCorrectIdentification) {
    // Reward for correct identification
    return voterRole === 'BIOLOGIST' ? 5 : 3;
  } else {
    // Small penalty for incorrect
    return -1;
  }
}

/**
 * Process consensus update for an observation
 * Returns the identification that should be marked as consensus, if any
 */
export interface ConsensusResult {
  consensusIdentificationId: string | null;
  shouldUpdateStatus: boolean;
  newStatus: 'NEEDS_ID' | 'HAS_CANDIDATES' | 'CONSENSUS';
}

export function processConsensus(
  identifications: Array<{
    id: string;
    score: number;
    votes: Array<{ value: number; voter: { role: Role; reputation: number } }>;
  }>
): ConsensusResult {
  if (identifications.length === 0) {
    return {
      consensusIdentificationId: null,
      shouldUpdateStatus: true,
      newStatus: 'NEEDS_ID',
    };
  }
  
  // Calculate scores
  const scoredIdentifications = identifications.map((id) => ({
    ...id,
    calculatedScore: calculateIdentificationScore(id.votes),
  }));
  
  // Sort by score
  scoredIdentifications.sort((a, b) => b.calculatedScore - a.calculatedScore);
  
  const topScore = scoredIdentifications[0]?.calculatedScore || 0;
  const runnerUpScore = scoredIdentifications[1]?.calculatedScore || 0;
  
  // Check if we have consensus
  if (hasReachedConsensus(topScore, runnerUpScore)) {
    return {
      consensusIdentificationId: scoredIdentifications[0].id,
      shouldUpdateStatus: true,
      newStatus: 'CONSENSUS',
    };
  }
  
  // Has candidates but no consensus
  if (identifications.length > 0) {
    return {
      consensusIdentificationId: null,
      shouldUpdateStatus: true,
      newStatus: 'HAS_CANDIDATES',
    };
  }
  
  return {
    consensusIdentificationId: null,
    shouldUpdateStatus: false,
    newStatus: 'NEEDS_ID',
  };
}

