export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-qaliq-teal">
          QALIQ — Gestión Inteligente
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-qaliq-navy md:text-5xl">
          Tu ISO 9001, gestionada como un proyecto. <br />
          No como un cajón de archivos.
        </h1>
        <p className="text-lg text-slate-600">
          Catálogo de debes vivo, gestión documental con versionado, hallazgos al cierre,
          y un dashboard que tu director entiende en 5 segundos.
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href="/login"
          className="rounded-lg bg-qaliq-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-qaliq-navy/90"
        >
          Iniciar sesión
        </a>
        <a
          href="https://github.com/beto-llanos/qaliq-mvp"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          GitHub
        </a>
      </div>

      <p className="pt-8 text-xs text-slate-400">
        v0.1.0 — MVP en desarrollo
      </p>
    </main>
  );
}
