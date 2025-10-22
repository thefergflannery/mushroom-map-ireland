'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/map"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-forest-700"
              onClick={() => setIsOpen(false)}
            >
              Map
            </Link>
            <Link
              href="/species"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-forest-700"
              onClick={() => setIsOpen(false)}
            >
              Species Guide
            </Link>
            <Link
              href="/glossary"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-forest-700"
              onClick={() => setIsOpen(false)}
            >
              Glossary
            </Link>
            <Link
              href="/about"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-forest-700"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/accessibility"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-forest-700"
              onClick={() => setIsOpen(false)}
            >
              Accessibility
            </Link>
            <Link href="/observe" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-forest-600 hover:bg-forest-700">
                Add a Find
              </Button>
            </Link>
            <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

