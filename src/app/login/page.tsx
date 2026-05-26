import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-qaliq-teal">
            QALIQ
          </p>
          <h1 className="text-2xl font-bold text-qaliq-navy">Iniciar sesión</h1>
          <p className="text-sm text-slate-500">
            Accede a tu sistema de gestión.
          </p>
        </div>

        <LoginForm nextPath={next} />

        <p className="text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="font-semibold text-qaliq-navy hover:underline">
            Registra tu organización
          </a>
        </p>
      </div>
    </main>
  );
}
