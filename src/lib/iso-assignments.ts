import { db } from "@/lib/db";

/**
 * Ensures the org has an IsoClauseAssignment row for every clause of a standard.
 * Idempotent — safe to call on every page load.
 *
 * This is how a newly-registered org gets its working copy of the catalog
 * without us pre-creating thousands of rows at registration time.
 */
export async function ensureAssignmentsForOrg(
  organizationId: string,
  standardCode: string
) {
  const standard = await db.isoStandard.findUnique({
    where: { code: standardCode },
    include: { clauses: { select: { id: true } } },
  });
  if (!standard) return;

  const existing = await db.isoClauseAssignment.findMany({
    where: { organizationId },
    select: { clauseId: true },
  });
  const existingIds = new Set(existing.map((a) => a.clauseId));

  const missing = standard.clauses.filter((c) => !existingIds.has(c.id));
  if (missing.length === 0) return;

  await db.isoClauseAssignment.createMany({
    data: missing.map((c) => ({
      organizationId,
      clauseId: c.id,
      applies: true,
      status: "NOT_STARTED" as const,
    })),
    skipDuplicates: true,
  });
}
