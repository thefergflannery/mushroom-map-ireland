import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-700">Authentication Error</CardTitle>
          <CardDescription>
            Something went wrong during sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              {searchParams.error || 'An unexpected error occurred'}
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/auth/signin">
              <Button className="w-full bg-forest-600 hover:bg-forest-700">
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-xs text-center text-gray-500">
            <p>
              If the problem persists, please{' '}
              <Link href="/contact" className="text-forest-700 hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

