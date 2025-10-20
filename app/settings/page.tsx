import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SettingsClient } from '@/components/settings/settings-client';

export const metadata: Metadata = {
  title: 'Account Settings - Mushroom Map Ireland',
  description: 'Manage your account settings and preferences',
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return <SettingsClient user={session.user} />;
}
