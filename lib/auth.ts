import NextAuth, { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import { generateHandle } from './utils';

// Build providers array conditionally
const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
];

// Only add email provider if email server is configured
const emailConfig = {
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  user: process.env.EMAIL_SERVER_USER,
  pass: process.env.EMAIL_SERVER_PASSWORD,
  from: process.env.EMAIL_FROM || 'noreply@beacain.ie',
};

// Temporarily disable email provider to isolate Google OAuth issues
// if (emailConfig.host && emailConfig.user && emailConfig.pass) {
//   try {
//     providers.push(
//       EmailProvider({
//         server: {
//           host: emailConfig.host,
//           port: emailConfig.port,
//           auth: {
//             user: emailConfig.user,
//             pass: emailConfig.pass,
//           },
//         },
//         from: emailConfig.from,
//       })
//     );
//     console.log('Email provider configured successfully');
//   } catch (error) {
//     console.error('Failed to configure email provider:', error);
//   }
// } else {
//   console.log('Email provider not configured - missing environment variables');
// }
console.log('Email provider temporarily disabled for testing');

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  debug: true,
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('SignIn event:', { 
        email: user.email, 
        provider: account?.provider,
        isNewUser 
      });
    },
    async signOut({ session, token }) {
      console.log('SignOut event:', { 
        userId: session?.user?.id 
      });
    },
    async createUser({ user }) {
      console.log('CreateUser event:', { 
        email: user.email,
        id: user.id 
      });
      
      try {
        // Add custom fields to the user created by Prisma adapter
        const handle = generateHandle(user.email);
        let finalHandle = handle;
        
        // Check if handle exists and make it unique
        let handleExists = await prisma.user.findUnique({
          where: { handle: finalHandle },
        });
        
        let suffix = 1;
        while (handleExists) {
          finalHandle = `${handle}-${suffix}`;
          handleExists = await prisma.user.findUnique({
            where: { handle: finalHandle },
          });
          suffix++;
        }
        
        // Update the user with our custom fields
        await prisma.user.update({
          where: { id: user.id },
          data: {
            handle: finalHandle,
            role: 'USER',
            reputation: 0,
          },
        });
        
        console.log('CreateUser: Added custom fields - handle:', finalHandle);
      } catch (error) {
        console.error('CreateUser event error:', error);
      }
    },
    async linkAccount({ user, account, profile }) {
      console.log('LinkAccount event:', { 
        email: user.email,
        provider: account.provider,
        accountId: account.providerAccountId 
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, handle: true, reputation: true },
        });
        
        if (dbUser && session.user) {
          Object.assign(session.user, {
            role: dbUser.role,
            handle: dbUser.handle,
            reputation: dbUser.reputation,
          });
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn callback triggered:', { 
        email: user.email, 
        provider: account?.provider,
        userId: user.id,
        accountId: account?.providerAccountId
      });
      
      if (!user.email) {
        console.log('SignIn: No email provided');
        return false;
      }
      
      // Always allow sign-in - let the Prisma adapter handle user creation
      // We'll add custom fields in the events
      return true;
    },
    async linkAccount({ user, account, profile }) {
      console.log('LinkAccount callback triggered:', {
        email: user.email,
        provider: account.provider,
        accountId: account.providerAccountId,
        userId: user.id
      });
      
      // Let the Prisma adapter handle account linking
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Helper functions for NextAuth v4
export const auth = async () => {
  return getServerSession(authOptions);
};

export const signIn = async (provider?: string, options?: any) => {
  return handler.signIn(provider, options);
};

export const signOut = async (options?: any) => {
  return handler.signOut(options);
};

