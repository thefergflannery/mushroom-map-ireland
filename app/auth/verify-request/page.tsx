import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🍄</span>
            <span className="text-2xl font-bold text-forest-700">Mushroom Map Ireland</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-forest-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle className="text-center text-2xl">Check your email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-slate-700 leading-relaxed">
              We've sent you a magic link to sign in. Click the link in your email to continue.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Didn't receive the email?</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Wait a few minutes - it can take time to arrive</li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full">
                  Try a different email
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-slate-500 mt-6">
          The sign-in link will expire in 24 hours for security reasons.
        </p>
      </div>
    </div>
  );
}

