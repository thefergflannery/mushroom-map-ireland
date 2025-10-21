'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

interface ModerationQueueProps {
  observations: any[];
}

export function ModerationQueue({ observations }: ModerationQueueProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-forest-900">Moderation Queue</h2>
          <p className="text-slate-600 mt-2">
            {observations.length} observation{observations.length !== 1 ? 's' : ''} pending review
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
                        <Button className="bg-forest-700 hover:bg-forest-800">
                          Review Observation →
                        </Button>
                      </Link>
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

