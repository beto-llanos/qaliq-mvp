import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Google OAuth is opt-in. If creds aren't set (typical for self-hosted MVP
// deployments), skip the provider entirely so Auth.js doesn't choke on
// undefined client id/secret at boot.
const googleProvider =
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : [];

const config: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  // JWT strategy is required by Auth.js v5 to use the Credentials provider.
  // Database sessions only work with OAuth providers. We still keep the
  // Prisma adapter so the User / Account tables stay in sync for Google
  // sign-ins, and we encrypt the JWT with AUTH_SECRET.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...googleProvider,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email, deletedAt: null },
        });
        if (!user?.hashedPassword) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.hashedPassword);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          organizationId: user.organizationId,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Only runs on initial sign-in (when `user` is set). Persist the
      // tenant context to the token so subsequent requests don't hit the DB.
      if (user) {
        token.userId = user.id;
        // From Credentials: organizationId + role come straight from authorize.
        // From OAuth (Google): we need to look them up since the adapter only
        // gives us id + email + name.
        if ("organizationId" in user && user.organizationId) {
          token.organizationId = user.organizationId;
          token.role = user.role;
        } else if (user.id) {
          const dbUser = await db.user.findUnique({
            where: { id: user.id },
            select: { organizationId: true, role: true },
          });
          if (dbUser) {
            token.organizationId = dbUser.organizationId;
            token.role = dbUser.role;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
        session.user.organizationId = token.organizationId as string;
        session.user.role = token.role as typeof session.user.role;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
