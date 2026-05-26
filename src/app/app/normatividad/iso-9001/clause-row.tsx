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
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-800">
            {clause.number} — {clause.title}
          </p>
          {clause.description ? (
            <p className="text-xs text-slate-500">{clause.description}</p>
          ) : null}
        </div>
        {assignment ? <StatusBadge status={assignment.status} /> : null}
      </div>

      {children.length > 0 ? (
        <ul className="space-y-1 bg-slate-50/50 px-5 pb-3">
          {children.map(({ clause: leaf, assignment: leafAssignment }) => (
            <li
              key={leaf.id}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-white"
            >
              <div className="min-w-0 flex-1">
                <span className="font-mono text-xs text-slate-500">{leaf.number}</span>{" "}
                <span className="text-slate-700">{leaf.title}</span>
                {leaf.isMust && leaf.mustText ? (
                  <p className="mt-0.5 text-xs italic text-slate-500">
                    {leaf.mustText}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                {leafAssignment?.assignedTo ? (
                  <span className="text-xs text-slate-500">
                    {leafAssignment.assignedTo.name ?? leafAssignment.assignedTo.email}
                  </span>
                ) : (
                  <span className="text-xs italic text-slate-400">Sin asignar</span>
                )}
                {leafAssignment ? <StatusBadge status={leafAssignment.status} /> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
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
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {label[status]}
    </span>
  );
}
