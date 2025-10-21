import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { AuthProvider } from '@/components/auth/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Mushroom Map Ireland | Citizen Science Fungal Identification',
  description:
    'Privacy-first citizen science platform for identifying and mapping mushrooms across Ireland. Community-driven fungal identification with AI assistance.',
  keywords: ['mushrooms', 'Ireland', 'citizen science', 'mycology', 'fungi', 'identification'],
  authors: [{ name: 'Mushroom Map Ireland' }],
  openGraph: {
    title: 'Mushroom Map Ireland',
    description: 'Privacy-first mushroom identification and mapping for Ireland',
    type: 'website',
    locale: 'en_IE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <AuthProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <Header />
          <div className="pt-20" id="main-content">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
