import { requireTenant } from "@/lib/tenant";
import { db } from "@/lib/db";
import { ensureAssignmentsForOrg } from "@/lib/iso-assignments";
import { ClauseRow } from "./clause-row";

export const dynamic = "force-dynamic";

export default async function NormatividadPage() {
  const { organizationId } = await requireTenant();

  // Idempotent: ensures every leaf clause has an assignment row for this org.
  await ensureAssignmentsForOrg(organizationId, "ISO-9001");

  const standard = await db.isoStandard.findUnique({
    where: { code: "ISO-9001" },
    include: {
      clauses: {
        // Natural sort applied in JS below — Prisma can't sort "4.10" vs "4.2"
        // correctly because `number` is a String column.
        include: {
          assignments: {
            where: { organizationId },
            include: { assignedTo: true },
          },
        },
      },
    },
  });

  if (!standard) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm text-amber-800">
          El catálogo ISO 9001 no está cargado. Ejecuta{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
            npm run db:seed
          </code>{" "}
          para precargar las cláusulas.
        </p>
      </div>
    );
  }

  // Natural sort by clause number so "10" > "4" and "4.10" > "4.2".
  const byNumber = (a: { number: string }, b: { number: string }) =>
    a.number.localeCompare(b.number, undefined, { numeric: true, sensitivity: "base" });

  const chapters = standard.clauses.filter((c) => !c.parentId).sort(byNumber);
  const childrenByParent = new Map<string, typeof standard.clauses>();
  for (const clause of standard.clauses) {
    if (!clause.parentId) continue;
    const arr = childrenByParent.get(clause.parentId) ?? [];
    arr.push(clause);
    childrenByParent.set(clause.parentId, arr);
  }
  for (const arr of childrenByParent.values()) {
    arr.sort(byNumber);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-qaliq-navy">{standard.name}</h1>
        <p className="text-sm text-slate-500">
          Catálogo de cláusulas. Marca aplicabilidad, asigna responsables y registra el estado.
        </p>
      </header>

      <div className="space-y-3">
        {chapters.map((chapter) => {
          const children = childrenByParent.get(chapter.id) ?? [];
          return (
            <details
              key={chapter.id}
              className="rounded-xl border border-slate-200 bg-white"
            >
              <summary className="cursor-pointer select-none px-5 py-4 text-base font-semibold text-qaliq-navy">
                {chapter.number} — {chapter.title}
              </summary>
              <div className="border-t border-slate-100">
                {children.map((sub) => {
                  const subChildren = childrenByParent.get(sub.id) ?? [];
                  return (
                    <ClauseRow
                      key={sub.id}
                      clause={sub}
                      assignment={sub.assignments[0] ?? null}
                      children={subChildren.map((leaf) => ({
                        clause: leaf,
                        assignment: leaf.assignments[0] ?? null,
                      }))}
                    />
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
