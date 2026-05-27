import type { IsoClause, IsoClauseAssignment, ClauseStatus, User } from "@prisma/client";

type AssignmentWithUser =
  | (IsoClauseAssignment & { assignedTo: User | null })
  | null;

type LeafRow = {
  clause: IsoClause;
  assignment: AssignmentWithUser;
};

export function ClauseRow({
  clause,
  assignment,
  children,
}: {
  clause: IsoClause;
  assignment: AssignmentWithUser;
  children: LeafRow[];
}) {
  const hasDetail = Boolean(clause.mustText || clause.guidance);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <div className="flex items-start justify-between gap-4 px-5 py-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-slate-800">
            {clause.number} — {clause.title}
          </p>
          {clause.description ? (
            <p className="text-xs leading-relaxed text-slate-500">{clause.description}</p>
          ) : null}
          {hasDetail ? <ClauseDetails clause={clause} /> : null}
        </div>
        {assignment ? <StatusBadge status={assignment.status} /> : null}
      </div>

      {children.length > 0 ? (
        <ul className="space-y-1 bg-slate-50/50 px-5 pb-3">
          {children.map(({ clause: leaf, assignment: leafAssignment }) => (
            <li
              key={leaf.id}
              className="rounded-md px-2 py-1.5 text-sm hover:bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-xs text-slate-500">{leaf.number}</span>{" "}
                  <span className="text-slate-700">{leaf.title}</span>
                  {leaf.description ? (
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {leaf.description}
                    </p>
                  ) : null}
                  {leaf.mustText || leaf.guidance ? (
                    <ClauseDetails clause={leaf} />
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {leafAssignment?.assignedTo ? (
                    <span className="text-xs text-slate-500">
                      {leafAssignment.assignedTo.name ?? leafAssignment.assignedTo.email}
                    </span>
                  ) : (
                    <span className="text-xs italic text-slate-400">Sin asignar</span>
                  )}
                  {leafAssignment ? <StatusBadge status={leafAssignment.status} /> : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ClauseDetails({ clause }: { clause: IsoClause }) {
  return (
    <details className="mt-1 group">
      <summary className="cursor-pointer select-none text-xs font-medium text-qaliq-navy/70 hover:text-qaliq-navy">
        <span className="group-open:hidden">Ver detalle ▾</span>
        <span className="hidden group-open:inline">Ocultar detalle ▴</span>
      </summary>
      <div className="mt-2 space-y-2.5 rounded-md border border-slate-200 bg-slate-50/70 p-3">
        {clause.mustText ? (
          <section>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Texto de la norma
            </h4>
            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-700">
              {clause.mustText}
            </p>
          </section>
        ) : null}
        {clause.guidance ? (
          <section>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Cómo cumplirlo
            </h4>
            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-700">
              {clause.guidance}
            </p>
          </section>
        ) : null}
      </div>
    </details>
  );
}

function StatusBadge({ status }: { status: ClauseStatus }) {
  const styles: Record<ClauseStatus, string> = {
    NOT_STARTED: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
    NOT_APPLICABLE: "bg-slate-50 text-slate-400",
  };
  const label: Record<ClauseStatus, string> = {
    NOT_STARTED: "Pendiente",
    IN_PROGRESS: "En proceso",
    COMPLETED: "Completo",
    NOT_APPLICABLE: "N/A",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {label[status]}
    </span>
  );
}
