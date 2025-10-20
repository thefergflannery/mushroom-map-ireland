'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SettingsClientProps {
  user: {
    id?: string;
    email?: string | null;
    handle?: string;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();
  const [handle, setHandle] = useState(user.handle || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!handle.trim()) {
      toast.error('Handle cannot be empty');
      return;
    }

    // Validate handle format
    if (!/^[a-zA-Z0-9_-]+$/.test(handle)) {
      toast.error('Handle can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    if (handle.length < 3 || handle.length > 30) {
      toast.error('Handle must be between 3 and 30 characters');
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading('Saving settings...');

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle,
          emailNotifications,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      toast.success('Settings saved successfully!', { id: loadingToast });
      
      // Redirect to profile
      router.push(`/profile/${handle}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings', { id: loadingToast });
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost">← Back</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your profile and preferences</p>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed (managed by authentication provider)
                </p>
              </div>

              <div>
                <label htmlFor="handle" className="block text-sm font-medium mb-2">
                  Username/Handle
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">@</span>
                  <Input
                    id="handle"
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="your-username"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your public username. Can only contain letters, numbers, hyphens, and underscores.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your observations and activity
                  </p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  You'll receive notifications about:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                  <li className="flex items-center gap-2">
                    <span className={emailNotifications ? 'text-green-600' : 'text-gray-400'}>✓</span>
                    Comments on your observations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={emailNotifications ? 'text-green-600' : 'text-gray-400'}>✓</span>
                    Consensus reached on your identifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={emailNotifications ? 'text-green-600' : 'text-gray-400'}>✓</span>
                    When someone mentions you
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={emailNotifications ? 'text-green-600' : 'text-gray-400'}>✓</span>
                    Important platform updates
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>Control your data and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Location Privacy</p>
                  <p className="text-sm text-muted-foreground">
                    All observations are automatically grid-snapped
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Protected
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Your profile is public</p>
                </div>
                <Badge variant="outline">Public</Badge>
              </div>

              <div className="pt-2">
                <Link href="/privacy">
                  <Button variant="link" className="p-0">
                    View Privacy Policy →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-700">Delete Account</p>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  Delete Account
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Account deletion is currently disabled. Contact support to delete your account.
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4 justify-end sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
            <Link href={`/profile/${handle}`}>
              <Button variant="outline" disabled={saving}>
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

