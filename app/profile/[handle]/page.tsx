import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: { handle: string };
}

export default async function ProfilePage({ params }: PageProps) {
  const session = await auth();
  
  const user = await prisma.user.findUnique({
    where: { handle: params.handle },
    include: {
      observations: {
        orderBy: { createdAt: 'desc' },
        take: 12,
        include: {
          identifications: {
            where: { isConsensus: true },
            take: 1,
            include: {
              species: {
                select: {
                  latinName: true,
                  commonEn: true,
                },
              },
            },
          },
        },
      },
      identifications: {
        where: { isConsensus: true },
        include: {
          species: {
            select: {
              latinName: true,
              commonEn: true,
            },
          },
        },
      },
      votes: {
        include: {
          identification: {
            include: {
              species: {
                select: {
                  latinName: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          observations: true,
          identifications: true,
          votes: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === user.id;

  const roleColors: Record<string, string> = {
    USER: 'bg-gray-500',
    TRUSTED: 'bg-blue-500',
    MOD: 'bg-purple-500',
    BIOLOGIST: 'bg-green-600',
    ADMIN: 'bg-red-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost">← Back to Map</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.handle}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-forest-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-forest-600 text-white flex items-center justify-center text-3xl font-bold">
                    {user.handle.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">@{user.handle}</h1>
                    <p className="text-gray-600 mb-3">{user.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`${roleColors[user.role]} text-white`}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline" className="text-forest-700 border-forest-600">
                        ⭐ {user.reputation} reputation
                      </Badge>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <Button variant="outline">Edit Profile</Button>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-forest-700">{user._count.observations}</p>
                    <p className="text-sm text-gray-600">Observations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-forest-700">{user.identifications.length}</p>
                    <p className="text-sm text-gray-600">Consensus IDs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-forest-700">{user._count.votes}</p>
                    <p className="text-sm text-gray-600">Votes Cast</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-forest-700">{user._count.comments}</p>
                    <p className="text-sm text-gray-600">Comments</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              <p>Member since {formatDate(user.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Observations */}
        {user.observations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Observations</CardTitle>
                <span className="text-sm text-gray-500">{user._count.observations} total</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.observations.map((obs) => (
                  <Link key={obs.id} href={`/observation/${obs.id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                        <Image
                          src={obs.photoUrl}
                          alt="Observation"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-1">
                        {obs.identifications[0]?.species ? (
                          <p className="text-xs font-medium italic truncate">
                            {obs.identifications[0].species.latinName}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">Needs ID</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user._count.observations >= 1 && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">🍄</div>
                  <p className="font-medium text-sm">First Observation</p>
                </div>
              )}
              {user._count.observations >= 10 && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="font-medium text-sm">10 Observations</p>
                </div>
              )}
              {user.identifications.length >= 1 && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="font-medium text-sm">Consensus ID</p>
                </div>
              )}
              {user._count.votes >= 10 && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">👥</div>
                  <p className="font-medium text-sm">Active Voter</p>
                </div>
              )}
            </div>
            {user._count.observations === 0 && user._count.votes === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No achievements yet. Start contributing to earn badges!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

