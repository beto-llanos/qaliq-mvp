import type { Role } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      organizationId: string;
      role: Role;
    };
  }

  // What we return from `authorize()` in the Credentials provider.
  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    organizationId?: string;
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    organizationId?: string;
    role?: Role;
  }
}
