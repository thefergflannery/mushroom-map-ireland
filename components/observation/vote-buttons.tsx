'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface VoteButtonsProps {
  identificationId: string;
  currentVote?: number | null;
  voteCount: number;
  score: number;
}

export function VoteButtons({ identificationId, currentVote, voteCount, score }: VoteButtonsProps) {
  const router = useRouter();
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  const handleVote = async (value: 1 | -1) => {
    setVoting(true);
    setError('');

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identificationId,
          value,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to vote');
      }

      toast.success(value === 1 ? 'Voted: Agree ✓' : 'Voted: Disagree ✗');
      
      // Refresh page to show updated votes
      router.refresh();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to vote';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Vote error:', err);
    } finally {
      setVoting(false);
    }
  };

  // Calculate score bar width
  const maxScore = 20;
  const scorePercentage = Math.min(Math.abs(score) / maxScore * 100, 100);
  const isPositive = score >= 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant={currentVote === 1 ? 'default' : 'outline'}
          onClick={() => handleVote(1)}
          disabled={voting}
          className={`${currentVote === 1 ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-green-50 hover:border-green-600'} transition-all`}
        >
          <span className="text-lg mr-1">👍</span> Agree
        </Button>
        <Button
          size="sm"
          variant={currentVote === -1 ? 'default' : 'outline'}
          onClick={() => handleVote(-1)}
          disabled={voting}
          className={`${currentVote === -1 ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:bg-red-50 hover:border-red-600'} transition-all`}
        >
          <span className="text-lg mr-1">👎</span> Disagree
        </Button>
      </div>

      {/* Score Visualization */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{voteCount} vote{voteCount !== 1 ? 's' : ''}</span>
          <span className={`font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
            Score: {score > 0 ? '+' : ''}{score}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
        {score >= 10 && (
          <p className="text-xs text-green-700 font-medium">
            🎯 Strong consensus support
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

