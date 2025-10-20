import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ObserveClient } from '@/components/observe/observe-client';

export default async function ObservePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/observe');
  }

  return <ObserveClient user={session.user} />;
}
