import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string; verify?: string };
}) {
  const session = await auth();
  
  // If already signed in, redirect
  if (session?.user) {
    redirect(searchParams.callbackUrl || '/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🍄</span>
            <span className="text-2xl font-bold text-forest-700">Mushroom Map Ireland</span>
          </Link>
          <p className="text-gray-600">Join our citizen science community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Sign in to contribute observations and join the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams.verify && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✓ Check your email! We sent you a sign-in link.
              </div>
            )}

            {searchParams.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {searchParams.error === 'OAuthSignin' && 'Error signing in with provider'}
                {searchParams.error === 'OAuthCallback' && 'Error in OAuth callback'}
                {searchParams.error === 'OAuthCreateAccount' && 'Could not create account'}
                {searchParams.error === 'EmailCreateAccount' && 'Could not create account'}
                {searchParams.error === 'Callback' && 'Authentication error'}
                {searchParams.error === 'OAuthAccountNotLinked' && 'Account already exists with different provider'}
                {searchParams.error === 'EmailSignin' && 'Error sending email. Please try again.'}
                {searchParams.error === 'CredentialsSignin' && 'Sign in failed'}
                {searchParams.error === 'SessionRequired' && 'Please sign in to continue'}
                {!searchParams.error.match(/OAuth|Email|Credentials|Session/) && 'Authentication error occurred'}
              </div>
            )}

            {/* Email Magic Link - Only show if email provider is configured */}
            {process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD ? (
              <>
                <form
                  action={async (formData: FormData) => {
                    'use server';
                    const email = formData.get('email');
                    await signIn('email', {
                      email,
                      redirectTo: searchParams.callbackUrl || '/',
                    });
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-forest-700 hover:bg-forest-800 h-12 text-base font-medium"
                  >
                    Sign in with Email
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    We'll send you a magic link to sign in
                  </p>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm text-center">
                <p className="font-medium mb-1">Email sign-in not configured</p>
                <p>Please use Google sign-in or contact support to enable email authentication.</p>
              </div>
            )}

            {/* Google Sign In */}
            <form
              action={async () => {
                'use server';
                await signIn('google', {
                  redirectTo: searchParams.callbackUrl || '/',
                });
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12 text-base font-medium border-2"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </form>

            <div className="text-xs text-center text-gray-500 space-y-2">
              <p>
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-forest-700 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-forest-700 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-forest-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
