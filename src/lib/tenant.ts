import { auth } from "@/lib/auth";

/**
 * Resolves the current request's tenant context.
 * Every server-side data access MUST go through this — it returns the
 * organizationId that all queries must filter by.
 *
 * Throws if there is no session. Use this in server components, route
 * handlers, and server actions to enforce tenant isolation.
 */
export async function requireTenant() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("UNAUTHORIZED: no tenant context");
  }
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
    role: session.user.role,
  };
}
