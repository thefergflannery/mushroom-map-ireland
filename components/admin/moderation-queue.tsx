'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface ModerationQueueProps {
  observations: any[];
}

export function ModerationQueue({ observations: initialObservations }: ModerationQueueProps) {
  const [observations, setObservations] = useState(initialObservations);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const statusColors = {
    NEEDS_ID: 'bg-red-100 text-red-700 border-red-300',
    HAS_CANDIDATES: 'bg-amber-100 text-amber-700 border-amber-300',
    CONSENSUS: 'bg-forest-100 text-forest-700 border-forest-300',
  };

  const statusLabels = {
    NEEDS_ID: 'Needs ID',
    HAS_CANDIDATES: 'Under Review',
    CONSENSUS: 'Consensus',
  };

  const handleAcceptObservation = async (observationId: string) => {
    setIsProcessing(observationId);
    try {
      const response = await fetch(`/api/observations/${observationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONSENSUS' }),
      });

      if (!response.ok) throw new Error('Failed to accept observation');

      // Remove from queue
      setObservations(obs => obs.filter(o => o.id !== observationId));
      toast.success('Observation accepted');
    } catch (error) {
      console.error('Error accepting observation:', error);
      toast.error('Failed to accept observation');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectObservation = async (observationId: string) => {
    if (!confirm('Are you sure you want to reject this observation? This will delete it permanently.')) {
      return;
    }

    setIsProcessing(observationId);
    try {
      const response = await fetch(`/api/observations/${observationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to reject observation');

      // Remove from queue
      setObservations(obs => obs.filter(o => o.id !== observationId));
      toast.success('Observation rejected and deleted');
    } catch (error) {
      console.error('Error rejecting observation:', error);
      toast.error('Failed to reject observation');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-forest-900">All Observations</h2>
          <p className="text-slate-600 mt-2">
            {observations.length} observation{observations.length !== 1 ? 's' : ''} • Review and moderate submissions
          </p>
        </div>
      </div>

      {observations.length === 0 ? (
        <Card className="card-modern">
          <CardContent className="py-16 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">All caught up!</h3>
            <p className="text-slate-600">No observations pending moderation</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {observations.map((obs) => (
            <Card key={obs.id} className="card-modern hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Photo */}
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={obs.photoUrl}
                      alt="Observation"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge className={`${statusColors[obs.status]} border mb-2`}>
                          {statusLabels[obs.status]}
                        </Badge>
                        <p className="text-sm text-slate-600">
                          Submitted by <span className="font-semibold">@{obs.user.handle}</span> • {formatRelativeTime(obs.createdAt)}
                        </p>
                      </div>
                    </div>

                    {obs.notes && (
                      <p className="text-slate-700 mb-3 line-clamp-2">{obs.notes}</p>
                    )}

                    {/* Identifications */}
                    {obs.identifications.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-900 mb-2">
                          Current IDs ({obs._count.identifications}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {obs.identifications.slice(0, 3).map((id: any) => (
                            <Badge key={id.id} variant="outline" className="font-medium">
                              {id.species?.commonEn || 'Unknown'} (by @{id.proposer.handle})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
                      <span>{obs._count.identifications} identifications</span>
                      <span>{obs._count.comments} comments</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/observation/${obs.id}`}>
                        <Button variant="outline" className="border-forest-700 text-forest-700 hover:bg-forest-50">
                          Review Details →
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => handleAcceptObservation(obs.id)}
                        disabled={isProcessing === obs.id}
                        className="bg-forest-700 hover:bg-forest-800"
                      >
                        {isProcessing === obs.id ? 'Processing...' : '✓ Accept'}
                      </Button>
                      <Button 
                        onClick={() => handleRejectObservation(obs.id)}
                        disabled={isProcessing === obs.id}
                        variant="destructive"
                      >
                        {isProcessing === obs.id ? 'Processing...' : '✗ Reject'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

