import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { getDisplayCoordinates } from '@/lib/geo/grid';

interface PageProps {
  params: { id: string };
}

export default async function ObservationPage({ params }: PageProps) {
  const session = await auth();
  const viewerRole = session?.user ? (session.user as any).role : undefined;

  const observation = await prisma.observation.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          handle: true,
          role: true,
          image: true,
          reputation: true,
        },
      },
      identifications: {
        include: {
          species: true,
          proposer: {
            select: {
              id: true,
              handle: true,
              role: true,
              image: true,
            },
          },
          votes: {
            include: {
              voter: {
                select: {
                  id: true,
                  handle: true,
                  role: true,
                  reputation: true,
                },
              },
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: { score: 'desc' },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              handle: true,
              role: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: {
          identifications: true,
          comments: true,
        },
      },
    },
  });

  if (!observation) {
    notFound();
  }

  const consensusSpecies = observation.identifications.find((id) => id.isConsensus)?.species;
  const displayCoords = getDisplayCoordinates(
    observation.lat,
    observation.lng,
    observation.privacyLevel,
    consensusSpecies?.sensitive || false,
    viewerRole
  );

  const edibilityColors = {
    CHOICE: 'bg-green-500',
    EDIBLE: 'bg-green-400',
    CAUTION: 'bg-yellow-500',
    TOXIC: 'bg-orange-500',
    DEADLY: 'bg-red-500',
    UNKNOWN: 'bg-gray-400',
  };

  const statusLabels = {
    NEEDS_ID: 'Needs Identification',
    HAS_CANDIDATES: 'Has Candidates',
    CONSENSUS: 'Consensus Reached',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost">← Back to Map</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo */}
            <Card>
              <CardContent className="p-0">
                <img
                  src={observation.photoUrl}
                  alt="Mushroom observation"
                  className="w-full h-auto rounded-t-lg"
                />
              </CardContent>
            </Card>

            {/* Identifications */}
            <Card>
              <CardHeader>
                <CardTitle>Identifications</CardTitle>
                <CardDescription>
                  {observation._count.identifications} identification
                  {observation._count.identifications !== 1 ? 's' : ''} proposed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {observation.identifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No identifications yet. Be the first to suggest one!</p>
                    <Button className="mt-4">Propose Identification</Button>
                  </div>
                ) : (
                  observation.identifications.map((identification) => (
                    <div
                      key={identification.id}
                      className={`p-4 border rounded-lg ${
                        identification.isConsensus ? 'border-green-500 bg-green-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {identification.species ? (
                            <div>
                              <h3 className="font-semibold text-lg italic">{identification.species.latinName}</h3>
                              <p className="text-muted-foreground">{identification.species.commonEn}</p>
                              {identification.species.commonGa && (
                                <p className="text-sm text-muted-foreground">({identification.species.commonGa})</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Unknown species</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {identification.isConsensus && (
                            <Badge variant="success" className="ml-2">
                              Consensus
                            </Badge>
                          )}
                          {identification.species && (
                            <Badge
                              className={edibilityColors[identification.species.edibility]}
                              variant="secondary"
                            >
                              {identification.species.edibility}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>
                          Proposed by{' '}
                          <Link
                            href={`/profile/${identification.proposer?.handle}`}
                            className="text-forest-700 hover:underline"
                          >
                            @{identification.proposer?.handle}
                          </Link>
                        </span>
                        <Badge variant="outline">{identification.method}</Badge>
                        {identification.confidence && (
                          <span>{Math.round(identification.confidence * 100)}% confident</span>
                        )}
                      </div>

                      {identification.rationale && (
                        <p className="text-sm mb-3">{identification.rationale}</p>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            👍 Agree
                          </Button>
                          <Button size="sm" variant="outline">
                            👎 Disagree
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Score: {identification.score} ({identification._count.votes} votes)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
                <CardDescription>
                  {observation._count.comments} comment{observation._count.comments !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {observation.comments.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No comments yet</p>
                ) : (
                  <div className="space-y-4">
                    {observation.comments.map((comment) => (
                      <div key={comment.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link
                                href={`/profile/${comment.user.handle}`}
                                className="font-medium hover:underline"
                              >
                                @{comment.user.handle}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={observation.status === 'CONSENSUS' ? 'success' : 'warning'}>
                  {statusLabels[observation.status]}
                </Badge>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Observed by</p>
                  <Link href={`/profile/${observation.user.handle}`} className="font-medium hover:underline">
                    @{observation.user.handle}
                  </Link>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(observation.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {displayCoords.lat.toFixed(4)}, {displayCoords.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">Grid: {observation.grid1km}</p>
                  <Badge variant="outline" className="mt-1">
                    {observation.privacyLevel.replace('_', ' ')}
                  </Badge>
                </div>
                {observation.notes && (
                  <div>
                    <p className="text-muted-foreground">Notes</p>
                    <p className="font-medium">{observation.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {session?.user && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full">Propose Identification</Button>
                  <Button variant="outline" className="w-full">
                    Add Comment
                  </Button>
                  {observation.userId === session.user.id && (
                    <>
                      <Button variant="outline" className="w-full">
                        Edit
                      </Button>
                      <Button variant="destructive" className="w-full">
                        Delete
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

