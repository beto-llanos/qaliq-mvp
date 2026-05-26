"use client";

import { useActionState } from "react";
import { registerAction, type RegisterState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-qaliq-navy focus:outline-none focus:ring-1 focus:ring-qaliq-navy";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Organización
        </legend>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nombre</label>
          <input name="organizationName" required minLength={2} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            RFC <span className="text-slate-400">(opcional)</span>
          </label>
          <input name="rfc" className={inputClass} />
        </div>
      </fieldset>

      <fieldset className="space-y-3 border-t border-slate-200 pt-4">
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Tu cuenta
        </legend>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nombre</label>
          <input name="name" required minLength={2} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Correo</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Contraseña</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            className={inputClass}
          />
          <p className="text-xs text-slate-400">Mínimo 8 caracteres.</p>
        </div>
      </fieldset>

      {state?.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-qaliq-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-qaliq-navy/90 disabled:opacity-50"
      >
        {pending ? "Creando…" : "Crear cuenta"}
      </button>
    </form>
  );
}
