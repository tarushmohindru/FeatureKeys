import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import User from '@/lib/user';
import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: "Username or Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials) {
            return null;
        }

        const { login, password } = credentials;

        const user = await User.findOne({
          $or: [{ email: login }, { username: login }],
        });

        if (user && bcrypt.compareSync(password, user.password)) {
          return { id: user._id.toString(), name: user.username, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: {token: JWT, user?: { id: string, role: string }}) {
        if (user) {
            token.role = user.role;
            token.id = user.id;
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.role = token.role;
            session.user.id = token.id;
        }
        return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
