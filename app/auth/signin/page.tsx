'use client';

import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const verify = searchParams.get('verify');
  
  // If already signed in, redirect
  useEffect(() => {
    if (session?.user) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

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
            {verify && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✓ Check your email! We sent you a sign-in link.
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error === 'OAuthSignin' && (
                  <div>
                    <p className="font-semibold mb-2">Error signing in with provider</p>
                    <p>There was an issue with the authentication provider. Please try again.</p>
                  </div>
                )}
                {error === 'OAuthCallback' && (
                  <div>
                    <p className="font-semibold mb-2">Authentication callback error</p>
                    <p>There was an issue processing your sign-in. Please try again.</p>
                  </div>
                )}
                {error === 'OAuthCreateAccount' && (
                  <div>
                    <p className="font-semibold mb-2">Could not create account</p>
                    <p>There was an issue creating your account. Please try again or contact support.</p>
                  </div>
                )}
                {error === 'EmailCreateAccount' && (
                  <div>
                    <p className="font-semibold mb-2">Could not create account</p>
                    <p>There was an issue creating your account. Please try again or contact support.</p>
                  </div>
                )}
                {error === 'Callback' && (
                  <div>
                    <p className="font-semibold mb-2">Authentication error</p>
                    <p>There was an issue with the authentication process. Please try again.</p>
                  </div>
                )}
                {error === 'OAuthAccountNotLinked' && (
                  <div>
                    <p className="font-semibold mb-2">Account linking issue resolved</p>
                    <p>You can now sign in with either Google or email using the same email address. Please try again.</p>
                  </div>
                )}
                {error === 'EmailSignin' && (
                  <div>
                    <p className="font-semibold mb-2">Error sending email</p>
                    <p>There was an issue sending the magic link. Please try again.</p>
                  </div>
                )}
                {error === 'CredentialsSignin' && (
                  <div>
                    <p className="font-semibold mb-2">Sign in failed</p>
                    <p>Invalid credentials. Please check your information and try again.</p>
                  </div>
                )}
                {error === 'SessionRequired' && (
                  <div>
                    <p className="font-semibold mb-2">Please sign in to continue</p>
                    <p>You need to sign in to access this page.</p>
                  </div>
                )}
                {!error.match(/OAuth|Email|Credentials|Session/) && (
                  <div>
                    <p className="font-semibold mb-2">Authentication error occurred</p>
                    <p>An unexpected error occurred. Please try again or contact support if the issue persists.</p>
                  </div>
                )}
              </div>
            )}

            {/* Email Magic Link - Temporarily disabled */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsLoading(true);
                await signIn('email', {
                  email,
                  callbackUrl,
                });
                setIsLoading(false);
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-forest-700 hover:bg-forest-800 h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Sign in with Email'}
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

            {/* Google Sign In */}
            <Button
              onClick={async () => {
                setIsLoading(true);
                await signIn('google', {
                  callbackUrl,
                });
              }}
              variant="outline"
              className="w-full h-12 text-base font-medium border-2"
              disabled={isLoading}
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
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

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

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
