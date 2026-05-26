// Re-export the Auth.js HTTP handlers under the /api/auth/[...nextauth] route.
// Kept in lib/ so the route file stays a tiny shim.
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
