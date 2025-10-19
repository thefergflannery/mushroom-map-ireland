import { describe, it, expect } from 'vitest';
import {
  calculateVoterWeight,
  calculateIdentificationScore,
  hasReachedConsensus,
  canResolveDirectly,
  processConsensus,
} from '@/lib/consensus/voting';
import { Role } from '@prisma/client';

describe('Voting and consensus logic', () => {
  describe('calculateVoterWeight', () => {
    it('should calculate correct weight for USER', () => {
      expect(calculateVoterWeight('USER' as Role, 0)).toBe(1);
      expect(calculateVoterWeight('USER' as Role, 100)).toBe(2); // +1 rep bonus
    });

    it('should calculate correct weight for BIOLOGIST', () => {
      expect(calculateVoterWeight('BIOLOGIST' as Role, 0)).toBe(5);
      expect(calculateVoterWeight('BIOLOGIST' as Role, 200)).toBe(7); // +2 rep bonus (max)
    });

    it('should calculate correct weight for TRUSTED', () => {
      expect(calculateVoterWeight('TRUSTED' as Role, 50)).toBe(2);
    });
  });

  describe('calculateIdentificationScore', () => {
    it('should calculate score from votes', () => {
      const votes = [
        { value: 1, voter: { role: 'USER' as Role, reputation: 0 } },
        { value: 1, voter: { role: 'BIOLOGIST' as Role, reputation: 0 } },
        { value: -1, voter: { role: 'USER' as Role, reputation: 0 } },
      ];

      const score = calculateIdentificationScore(votes);
      // (1 * 1) + (1 * 5) + (-1 * 1) = 5
      expect(score).toBe(5);
    });

    it('should handle empty votes', () => {
      expect(calculateIdentificationScore([])).toBe(0);
    });
  });

  describe('hasReachedConsensus', () => {
    it('should return true when threshold and margin met', () => {
      expect(hasReachedConsensus(12, 5, 10, 5)).toBe(true);
    });

    it('should return false when threshold not met', () => {
      expect(hasReachedConsensus(8, 2, 10, 5)).toBe(false);
    });

    it('should return false when margin not met', () => {
      expect(hasReachedConsensus(12, 10, 10, 5)).toBe(false);
    });
  });

  describe('canResolveDirectly', () => {
    it('should allow BIOLOGIST to resolve directly', () => {
      expect(canResolveDirectly('BIOLOGIST' as Role)).toBe(true);
    });

    it('should allow MOD to resolve directly', () => {
      expect(canResolveDirectly('MOD' as Role)).toBe(true);
    });

    it('should not allow USER to resolve directly', () => {
      expect(canResolveDirectly('USER' as Role)).toBe(false);
    });
  });

  describe('processConsensus', () => {
    it('should return NEEDS_ID for no identifications', () => {
      const result = processConsensus([]);
      
      expect(result.newStatus).toBe('NEEDS_ID');
      expect(result.consensusIdentificationId).toBe(null);
    });

    it('should return CONSENSUS when threshold met', () => {
      const identifications = [
        {
          id: 'id1',
          score: 15,
          votes: [
            { value: 1, voter: { role: 'BIOLOGIST' as Role, reputation: 0 } },
            { value: 1, voter: { role: 'BIOLOGIST' as Role, reputation: 0 } },
          ],
        },
        {
          id: 'id2',
          score: 3,
          votes: [{ value: 1, voter: { role: 'USER' as Role, reputation: 0 } }],
        },
      ];

      const result = processConsensus(identifications);
      
      expect(result.newStatus).toBe('CONSENSUS');
      expect(result.consensusIdentificationId).toBe('id1');
    });

    it('should return HAS_CANDIDATES when no consensus', () => {
      const identifications = [
        {
          id: 'id1',
          score: 5,
          votes: [{ value: 1, voter: { role: 'USER' as Role, reputation: 0 } }],
        },
      ];

      const result = processConsensus(identifications);
      
      expect(result.newStatus).toBe('HAS_CANDIDATES');
      expect(result.consensusIdentificationId).toBe(null);
    });
  });
});

