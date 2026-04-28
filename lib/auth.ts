import NextAuth, { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import { generateHandle } from './utils';

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
];

if (
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD
) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@beacain.ie',
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
  },
  events: {
    async createUser({ user }) {
      try {
        const base = generateHandle(user.email);
        let handle = base;
        let suffix = 1;

        while (await prisma.user.findUnique({ where: { handle } })) {
          handle = `${base}-${suffix++}`;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { handle, role: 'USER', reputation: 0 },
        });
      } catch (error) {
        console.error('createUser event error:', error);
      }
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
        if (dbUser) {
          Object.assign(session.user, {
            role: dbUser.role,
            handle: dbUser.handle,
            reputation: dbUser.reputation,
          });
        }
      }
      return session;
    },
    async signIn({ user }) {
      return !!user.email;
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

export const auth = async () => getServerSession(authOptions);
