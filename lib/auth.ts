import NextAuth, { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { generateHandle } from './utils';

// Build providers array conditionally
const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
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

if (emailConfig.host && emailConfig.user && emailConfig.pass) {
  try {
    providers.push(
      EmailProvider({
        server: {
          host: emailConfig.host,
          port: emailConfig.port,
          auth: {
            user: emailConfig.user,
            pass: emailConfig.pass,
          },
        },
        from: emailConfig.from,
      })
    );
    console.log('Email provider configured successfully');
  } catch (error) {
    console.error('Failed to configure email provider:', error);
  }
} else {
  console.log('Email provider not configured - missing environment variables');
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as NextAuthConfig['adapter'],
  providers,
  debug: true, // Enable debug for production to see what's happening
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
      
      try {
        // Check if user exists in our custom User table
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        
        if (!existingUser) {
          console.log('SignIn: Creating new user for:', user.email);
          
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
          
          console.log('SignIn: User created successfully');
        } else {
          console.log('SignIn: User already exists:', existingUser.handle);
          
          // Check if this account is already linked
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account?.provider,
            },
          });
          
          if (!existingAccount && account) {
            console.log('SignIn: Linking new account to existing user');
            // The Prisma adapter will handle account creation
          }
        }
        
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

