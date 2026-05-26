import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-qaliq-teal">
            QALIQ
          </p>
          <h1 className="text-2xl font-bold text-qaliq-navy">
            Registra tu organización
          </h1>
          <p className="text-sm text-slate-500">
            Quedarás como administrador. Podrás invitar a tu equipo después.
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="font-semibold text-qaliq-navy hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </main>
  );
}
