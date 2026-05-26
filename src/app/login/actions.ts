"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  next: z.string().nullish(),
});

export type LoginState = { error?: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: parsed.data.next || "/app/dashboard",
    });
    return null;
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Credenciales inválidas" };
    }
    // Next.js redirect throws — re-throw to let it propagate
    throw err;
  }
}
