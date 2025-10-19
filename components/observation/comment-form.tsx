'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CommentFormProps {
  observationId: string;
}

export function CommentForm({ observationId }: CommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!body.trim()) {
      setError('Please enter a comment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          observationId,
          body: body.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      // Success - refresh and clear
      router.refresh();
      setBody('');
    } catch (err: any) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-forest-600 focus:border-transparent"
        placeholder="Add your thoughts, observations, or questions..."
        maxLength={2000}
        disabled={submitting}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{body.length} / 2000 characters</p>
        <Button
          type="submit"
          disabled={!body.trim() || submitting}
          size="sm"
          className="bg-forest-600 hover:bg-forest-700"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </form>
  );
}

