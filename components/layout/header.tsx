import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { UserMenu } from '@/components/auth/user-menu';
import { MobileNav } from '@/components/ui/mobile-nav';

export async function Header() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="container-modern">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-4xl transition-transform group-hover:scale-110">🍄</div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-forest-900">Beacáin</div>
              <div className="text-xs text-slate-600 -mt-0.5">Mushroom Map Ireland</div>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/map" className="text-sm font-medium text-slate-700 hover:text-forest-700 transition-colors">
              Map
            </Link>
            <Link href="/species" className="text-sm font-medium text-slate-700 hover:text-forest-700 transition-colors">
              Species
            </Link>
            <Link href="/glossary" className="text-sm font-medium text-slate-700 hover:text-forest-700 transition-colors">
              Glossary
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-forest-700 transition-colors">
              About
            </Link>
            
            {session?.user ? (
              <>
                <Link href="/observe">
                  <Button className="bg-forest-700 hover:bg-forest-800 rounded-full">
                    Add Observation
                  </Button>
                </Link>
                <UserMenu user={session.user} />
              </>
            ) : (
              <Link href="/auth/signin">
                <Button className="bg-forest-700 hover:bg-forest-800 rounded-full">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

