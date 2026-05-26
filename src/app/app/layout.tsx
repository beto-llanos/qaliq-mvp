import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    redirect("/login");
  }

  const org = await db.organization.findUnique({
    where: { id: session.user.organizationId },
    select: { name: true },
  });

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-slate-200 bg-slate-50 px-4 py-6 md:block">
        <div className="px-2 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-qaliq-teal">
            QALIQ
          </p>
          <p className="truncate text-sm font-bold text-qaliq-navy">{org?.name}</p>
        </div>

        <nav className="space-y-1 text-sm">
          <NavLink href="/app/dashboard" label="Dashboard" />
          <NavLink href="/app/normatividad/iso-9001" label="Normatividad" />
          <NavLink href="/app/documentos" label="Documentos" muted />
          <NavLink href="/app/hallazgos" label="Hallazgos" muted />
        </nav>

        <div className="absolute bottom-6 left-4 w-56 border-t border-slate-200 pt-4">
          <p className="px-2 text-xs text-slate-500">{session.user.email}</p>
          <p className="px-2 text-xs text-slate-400">{session.user.role}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="mt-2 px-2 text-xs font-semibold text-red-600 hover:underline"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  label,
  muted,
}: {
  href: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <a
      href={href}
      className={`block rounded-md px-2 py-1.5 ${
        muted
          ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          : "text-slate-700 hover:bg-slate-200"
      }`}
    >
      {label}
      {muted ? <span className="ml-1 text-[10px] uppercase">próx.</span> : null}
    </a>
  );
}
