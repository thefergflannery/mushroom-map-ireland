import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { formatRelativeTime } from '@/lib/utils';
import Image from 'next/image';

export default async function ModerationPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/moderation');
  }

  const userRole = (session.user as any).role;
  const isModerator = ['MOD', 'BIOLOGIST', 'ADMIN'].includes(userRole);

  if (!isModerator) {
    redirect('/');
  }

  // Get open flags
  const flags = await prisma.flag.findMany({
    where: { status: 'open' },
    include: {
      observation: {
        include: {
          user: {
            select: {
              handle: true,
              role: true,
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
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Get recent resolved flags
  const resolvedFlags = await prisma.flag.findMany({
    where: { status: { in: ['resolved', 'dismissed'] } },
    include: {
      observation: {
        select: {
          id: true,
          photoUrl: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  // Get needs_id observations
  const needsIdObservations = await prisma.observation.findMany({
    where: { status: 'NEEDS_ID' },
    include: {
      user: {
        select: {
          handle: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">← Back to Map</Button>
          </Link>
          <h1 className="text-2xl font-bold text-forest-700">Moderation Queue</h1>
          <Badge className="bg-purple-600 text-white">{userRole}</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Open Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{flags.length}</div>
              <p className="text-sm text-gray-600">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Needs ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{needsIdObservations.length}</div>
              <p className="text-sm text-gray-600">Awaiting identification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{resolvedFlags.length}</div>
              <p className="text-sm text-gray-600">Flags processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Flagged Observations */}
        {flags.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Flagged Observations</CardTitle>
              <CardDescription>
                Review and resolve community-reported issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {flags.map((flag) => (
                <div key={flag.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <Link href={`/observation/${flag.observation.id}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={flag.observation.photoUrl}
                          alt="Flagged observation"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="destructive" className="mb-2">Flagged</Badge>
                          <p className="font-medium">Reason: {flag.reason}</p>
                          <p className="text-sm text-gray-600">
                            By @{flag.observation.user.handle} • {formatRelativeTime(flag.createdAt)}
                          </p>
                        </div>
                      </div>

                      {flag.observation.identifications[0]?.species && (
                        <p className="text-sm text-gray-700 italic mb-2">
                          Currently identified as: {flag.observation.identifications[0].species.latinName}
                        </p>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Link href={`/observation/${flag.observation.id}`}>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </Link>
                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline" className="text-gray-600">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Needs Identification */}
        <Card>
          <CardHeader>
            <CardTitle>Needs Identification</CardTitle>
            <CardDescription>
              Help the community by identifying these observations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {needsIdObservations.slice(0, 10).map((obs) => (
                <Link key={obs.id} href={`/observation/${obs.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                      <Image
                        src={obs.photoUrl}
                        alt="Needs identification"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-500 text-white text-xs">
                          Needs ID
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      @{obs.user.handle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {needsIdObservations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">🎉 All caught up!</p>
                <p className="text-sm">No observations need identification right now</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

