import { requireTenant } from "@/lib/tenant";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { organizationId } = await requireTenant();

  const [assignments, documents, findings] = await Promise.all([
    db.isoClauseAssignment.findMany({
      where: { organizationId, applies: true },
      select: { status: true },
    }),
    db.document.count({
      where: { organizationId, deletedAt: null },
    }),
    db.finding.findMany({
      where: { organizationId },
      select: { status: true },
    }),
  ]);

  const total = assignments.length || 1;
  const completed = assignments.filter((a) => a.status === "COMPLETED").length;
  const inProgress = assignments.filter((a) => a.status === "IN_PROGRESS").length;
  const compliancePct = Math.round((completed / total) * 100);

  const openFindings = findings.filter((f) => f.status !== "CLOSED").length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-qaliq-navy">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Estado general del sistema de gestión.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Cumplimiento ISO 9001"
          value={`${compliancePct}%`}
          accent="navy"
          sub={`${completed} de ${assignments.length} debes`}
        />
        <MetricCard
          label="Debes en progreso"
          value={String(inProgress)}
          accent="teal"
        />
        <MetricCard
          label="Documentos"
          value={String(documents)}
          accent="slate"
        />
        <MetricCard
          label="Hallazgos abiertos"
          value={String(openFindings)}
          accent={openFindings > 0 ? "red" : "slate"}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-qaliq-navy">
          Empezar aquí
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>
            Ve a{" "}
            <a
              href="/app/normatividad/iso-9001"
              className="font-semibold text-qaliq-navy hover:underline"
            >
              Normatividad
            </a>{" "}
            y revisa qué cláusulas aplican a tu organización.
          </li>
          <li>Asigna un responsable y fecha compromiso a cada debe.</li>
          <li>Sube evidencias en el módulo de Documentos (próximamente).</li>
        </ol>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  accent = "slate",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "navy" | "teal" | "red" | "slate";
}) {
  const accentClass = {
    navy: "text-qaliq-navy",
    teal: "text-qaliq-teal",
    red: "text-red-600",
    slate: "text-slate-700",
  }[accent];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${accentClass}`}>{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-400">{sub}</p> : null}
    </div>
  );
}
