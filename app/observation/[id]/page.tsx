import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { getDisplayCoordinates } from '@/lib/geo/grid';
import { VoteButtons } from '@/components/observation/vote-buttons';
import { IdentificationForm } from '@/components/observation/identification-form';
import { CommentForm } from '@/components/observation/comment-form';
import { ShareButton } from '@/components/observation/share-button';
import SimpleMap from '@/components/map/simple-map';

interface PageProps {
  params: { id: string };
}

export default async function ObservationPage({ params }: PageProps) {
  const session = await auth();
  const viewerRole = session?.user ? (session.user as any).role : undefined;

  const allSpecies = await prisma.species.findMany({
    orderBy: { latinName: 'asc' },
    select: {
      id: true,
      latinName: true,
      commonEn: true,
      commonGa: true,
      edibility: true,
    },
  });

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
    CHOICE: 'bg-forest-700 text-white',
    EDIBLE: 'bg-forest-600 text-white',
    CAUTION: 'bg-amber-500 text-white',
    TOXIC: 'bg-orange-600 text-white',
    DEADLY: 'bg-red-700 text-white',
    UNKNOWN: 'bg-slate-500 text-white',
  };

  const statusLabels = {
    NEEDS_ID: 'Needs Identification',
    HAS_CANDIDATES: 'Under Review',
    CONSENSUS: 'Consensus Reached',
  };

  const statusColors = {
    NEEDS_ID: 'bg-slate-100 text-slate-700 border-slate-300',
    HAS_CANDIDATES: 'bg-amber-50 text-amber-700 border-amber-300',
    CONSENSUS: 'bg-forest-50 text-forest-700 border-forest-300',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal Header */}
      <header className="bg-white border-b">
        <div className="container-modern py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="rounded-full">
                <span className="mr-2">←</span> Back to Map
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Badge className={`${statusColors[observation.status]} border px-4 py-1.5 rounded-full font-semibold`}>
                {statusLabels[observation.status]}
              </Badge>
              <ShareButton
                observationId={observation.id}
                title={consensusSpecies ? `${consensusSpecies.commonEn} (${consensusSpecies.latinName})` : 'Mushroom Observation'}
                description={`Check out this mushroom observation ${consensusSpecies ? `identified as ${consensusSpecies.commonEn}` : ''} on Mushroom Map Ireland`}
              />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Photo - Full Width */}
        <section className="relative h-[70vh] min-h-[600px] bg-slate-900">
          <Image
            src={observation.photoUrl}
            alt="Mushroom observation"
            fill
            className="object-contain"
            priority
          />
        </section>

        {/* Content Section */}
        <section className="section-sm bg-white">
          <div className="container-modern max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Observation Info */}
                <div>
                  {consensusSpecies && (
                    <div className="mb-6">
                      <h1 className="heading-hero text-forest-900 mb-2 italic">
                        {consensusSpecies.latinName}
                      </h1>
                      <p className="text-2xl font-semibold text-slate-700 mb-1">{consensusSpecies.commonEn}</p>
                      {consensusSpecies.commonGa && (
                        <p className="text-lg text-slate-500">{consensusSpecies.commonGa}</p>
                      )}
                      <div className="flex items-center gap-3 mt-4">
                        <Badge className={`${edibilityColors[consensusSpecies.edibility]} px-4 py-1.5 rounded-full font-bold text-sm`}>
                          {consensusSpecies.edibility}
                        </Badge>
                        {consensusSpecies.sensitive && (
                          <Badge className="bg-amber-500 text-white px-4 py-1.5 rounded-full font-bold text-sm">
                            Protected Species
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {!consensusSpecies && (
                    <div className="mb-6">
                      <h1 className="heading-hero text-slate-900 mb-2">
                        Unidentified Observation
                      </h1>
                      <p className="text-xl text-slate-600">Help identify this mushroom</p>
                    </div>
                  )}

                  {/* Observer Info */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-forest-700 text-white flex items-center justify-center text-xl font-bold">
                      {observation.user.handle?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Observed by</p>
                      <Link
                        href={`/profile/${observation.user.handle}`}
                        className="text-lg font-semibold text-forest-900 hover:text-forest-700"
                      >
                        @{observation.user.handle}
                      </Link>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-medium">{formatDate(observation.createdAt)}</p>
                    </div>
                  </div>

                  {observation.notes && (
                    <div className="p-6 bg-slate-50 rounded-xl mt-6">
                      <h3 className="text-lg font-semibold text-forest-900 mb-3">Observer Notes</h3>
                      <p className="text-slate-700 leading-relaxed">{observation.notes}</p>
                    </div>
                  )}
                </div>

                {/* Identifications */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-forest-900">
                      Identifications
                      <span className="text-slate-400 text-2xl ml-3">({observation._count.identifications})</span>
                    </h2>
                  </div>

                  {session?.user && (
                    <div className="mb-8">
                      <IdentificationForm
                        observationId={observation.id}
                        availableSpecies={allSpecies}
                      />
                    </div>
                  )}
                  
                  {observation.identifications.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xl text-slate-600 mb-4">No identifications yet</p>
                      <p className="text-slate-500">Be the first to suggest an identification!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {observation.identifications.map((identification) => (
                        <div
                          key={identification.id}
                          className={`card-modern p-6 ${
                            identification.isConsensus ? 'ring-2 ring-forest-700 bg-forest-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              {identification.species ? (
                                <div>
                                  <h3 className="text-2xl font-bold text-forest-900 italic">{identification.species.latinName}</h3>
                                  <p className="text-lg text-slate-700">{identification.species.commonEn}</p>
                                  {identification.species.commonGa && (
                                    <p className="text-sm text-slate-500">({identification.species.commonGa})</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-500">Unknown species</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {identification.isConsensus && (
                                <Badge className="bg-forest-700 text-white px-4 py-1.5 rounded-full font-bold">
                                  ✓ Consensus
                                </Badge>
                              )}
                              {identification.species && (
                                <Badge className={`${edibilityColors[identification.species.edibility]} px-3 py-1 rounded-full text-xs font-bold`}>
                                  {identification.species.edibility}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <span>
                              by{' '}
                              <Link
                                href={`/profile/${identification.proposer?.handle}`}
                                className="text-forest-700 hover:underline font-medium"
                              >
                                @{identification.proposer?.handle}
                              </Link>
                            </span>
                            <Badge variant="outline" className="text-xs">{identification.method}</Badge>
                            {identification.confidence && (
                              <span className="font-medium">{Math.round(identification.confidence * 100)}% confident</span>
                            )}
                          </div>

                          {identification.rationale && (
                            <p className="text-slate-700 mb-4 leading-relaxed">{identification.rationale}</p>
                          )}

                          {session?.user && identification.proposerUserId !== session.user.id ? (
                            <VoteButtons
                              identificationId={identification.id}
                              currentVote={
                                identification.votes.find((v) => v.voterUserId === session.user.id)?.value || null
                              }
                              voteCount={identification._count.votes}
                              score={identification.score}
                            />
                          ) : (
                            <div className="text-sm font-medium text-slate-600">
                              Score: <span className="text-forest-700">{identification.score}</span> ({identification._count.votes} vote{identification._count.votes !== 1 ? 's' : ''})
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div>
                  <h2 className="text-3xl font-bold text-forest-900 mb-6">
                    Discussion
                    <span className="text-slate-400 text-2xl ml-3">({observation._count.comments})</span>
                  </h2>

                  {observation.comments.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-lg text-slate-600">No comments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {observation.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 pb-6 border-b border-slate-100 last:border-0">
                          <div className="w-10 h-10 rounded-full bg-forest-700 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {comment.user.handle?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Link
                                href={`/profile/${comment.user.handle}`}
                                className="font-semibold text-forest-900 hover:text-forest-700"
                              >
                                @{comment.user.handle}
                              </Link>
                              <span className="text-sm text-slate-500">
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{comment.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {session?.user && (
                    <div className="mt-8">
                      <CommentForm observationId={observation.id} />
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Location Card */}
                  <Card className="card-modern">
                    <CardHeader>
                      <CardTitle className="text-xl">Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="h-48 rounded-lg overflow-hidden bg-slate-100 relative">
                        <SimpleMap 
                          observations={[{
                            id: observation.id,
                            lat: displayCoords.lat,
                            lng: displayCoords.lng,
                            status: observation.status,
                            photoUrl: observation.photoUrl
                          }]} 
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Privacy Level</p>
                        <Badge variant="outline" className="font-medium">
                          {observation.privacyLevel.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Grid: {observation.grid1km}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Metadata */}
                  <Card className="card-modern">
                    <CardHeader>
                      <CardTitle className="text-xl">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <p className="text-slate-500 mb-1">Date Observed</p>
                        <p className="font-semibold text-slate-900">
                          {observation.observedAt ? formatDate(observation.observedAt) : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Uploaded</p>
                        <p className="font-medium text-slate-700">{formatRelativeTime(observation.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {!session?.user && (
                    <Card className="card-modern bg-forest-50 border-forest-200">
                      <CardContent className="py-8 text-center">
                        <p className="text-forest-900 font-medium mb-4">
                          Sign in to vote, propose identifications, and comment
                        </p>
                        <Link href="/auth/signin">
                          <Button className="bg-forest-700 hover:bg-forest-800 rounded-full px-8">
                            Sign In
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
