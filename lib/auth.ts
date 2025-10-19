import NextAuth, { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { generateHandle } from './utils';

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Email magic link would be configured here
    // Requires email service setup (Resend, SendGrid, etc.)
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, handle: true, reputation: true },
        });
        
        if (dbUser) {
          (session.user as any).role = dbUser.role;
          (session.user as any).handle = dbUser.handle;
          (session.user as any).reputation = dbUser.reputation;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      // Create user if doesn't exist
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      
      if (!existingUser) {
        // Generate unique handle
        let handle = generateHandle(user.email);
        let handleExists = await prisma.user.findUnique({
          where: { handle },
        });
        
        let suffix = 1;
        while (handleExists) {
          handle = `${generateHandle(user.email)}-${suffix}`;
          handleExists = await prisma.user.findUnique({
            where: { handle },
          });
          suffix++;
        }
        
        await prisma.user.create({
          data: {
            email: user.email,
            handle,
            role: 'USER',
            reputation: 0,
          },
        });
      }
      
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

