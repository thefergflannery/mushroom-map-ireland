'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface HeroCTAProps {
  observationCount: number;
  speciesCount: number;
  userCount: number;
}

export function HeroCTA({ observationCount, speciesCount, userCount }: HeroCTAProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <>
        <div className="btn-primary opacity-50 animate-pulse">
          <FontAwesomeIcon icon={faSpinner} className="text-xl animate-spin" />
          Loading...
        </div>
        <div className="btn-outline opacity-50 animate-pulse">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      {session?.user ? (
        <>
          <Link href="/observe" className="btn-primary">
            <FontAwesomeIcon icon={faCamera} className="text-xl" />
            Submit Your Find
          </Link>
          <Link href="/map" className="btn-outline">
            Explore the Map
          </Link>
        </>
      ) : (
        <>
          <Link href="/auth/signin" className="btn-primary">
            Get Started
          </Link>
          <Link href="/species" className="btn-outline">
            Browse Species
          </Link>
        </>
      )}
    </>
  );
}
