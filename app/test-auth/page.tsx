import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function TestAuth() {
  const session = await auth();
  
  if (session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-lg font-semibold text-green-800">✅ Successfully Authenticated!</h2>
          <p className="text-green-700">Email: {session.user?.email}</p>
          <p className="text-green-700">Name: {session.user?.name}</p>
          <p className="text-green-700">ID: {session.user?.id}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      <div className="bg-red-100 p-4 rounded">
        <h2 className="text-lg font-semibold text-red-800">❌ Not Authenticated</h2>
        <p className="text-red-700">Please sign in to test authentication.</p>
        <a 
          href="/api/auth/signin/google" 
          className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </a>
      </div>
    </div>
  );
}
