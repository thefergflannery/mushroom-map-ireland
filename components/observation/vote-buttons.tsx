'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

      // Refresh page to show updated votes
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to vote');
      console.error('Vote error:', err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant={currentVote === 1 ? 'default' : 'outline'}
          onClick={() => handleVote(1)}
          disabled={voting}
          className={currentVote === 1 ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          👍 Agree
        </Button>
        <Button
          size="sm"
          variant={currentVote === -1 ? 'default' : 'outline'}
          onClick={() => handleVote(-1)}
          disabled={voting}
          className={currentVote === -1 ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          👎 Disagree
        </Button>
        <span className="text-sm text-gray-600">
          Score: <strong className="text-forest-700">{score}</strong> ({voteCount} vote{voteCount !== 1 ? 's' : ''})
        </span>
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

