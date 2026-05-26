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
  session: { strategy: "database" },
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
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        // Attach org + role to the session — needed by tenant middleware
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { id: true, organizationId: true, role: true },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.organizationId = dbUser.organizationId;
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
