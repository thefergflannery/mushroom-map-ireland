import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminClient } from '@/components/admin/admin-client';
import { prisma } from '@/lib/prisma';

async function getAdminData() {
  const [glossaryTerms, species, pendingObservations, allUsers] = await Promise.all([
    prisma.glossary.findMany({
      orderBy: { termGa: 'asc' },
    }),
    prisma.species.findMany({
      orderBy: { latinName: 'asc' },
      include: {
        _count: {
          select: {
            identifications: true,
          },
        },
      },
    }),
    prisma.observation.findMany({
      where: {
        status: {
          in: ['NEEDS_ID', 'HAS_CANDIDATES'],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            handle: true,
            image: true,
          },
        },
        identifications: {
          include: {
            species: true,
            proposer: {
              select: {
                handle: true,
              },
            },
          },
          orderBy: { score: 'desc' },
          take: 3,
        },
        _count: {
          select: {
            identifications: true,
            comments: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        handle: true,
        email: true,
        role: true,
        reputation: true,
        createdAt: true,
        _count: {
          select: {
            observations: true,
            identifications: true,
          },
        },
      },
    }),
  ]);

  return {
    glossaryTerms,
    species,
    pendingObservations,
    users: allUsers,
  };
}

export default async function AdminPage() {
  const session = await auth();

  // Check if user is authenticated and has admin/moderator role
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  const userRole = (session.user as any).role;
  if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
    redirect('/');
  }

  const data = await getAdminData();

  return <AdminClient user={session.user} data={data} />;
}

