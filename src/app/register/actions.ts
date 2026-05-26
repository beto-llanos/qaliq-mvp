"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";

const schema = z.object({
  organizationName: z.string().min(2, "Nombre de la organización requerido"),
  rfc: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  name: z.string().min(2, "Tu nombre es requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export type RegisterState = { error?: string } | null;

export async function registerAction(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = schema.safeParse({
    organizationName: formData.get("organizationName"),
    rfc: formData.get("rfc"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "Ya existe un usuario con ese correo" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  // First user of an org is ADMIN by definition.
  await db.organization.create({
    data: {
      name: parsed.data.organizationName,
      rfc: parsed.data.rfc,
      users: {
        create: {
          email: parsed.data.email,
          name: parsed.data.name,
          hashedPassword,
          role: "ADMIN",
        },
      },
    },
  });

  // Auto-sign-in then redirect to dashboard.
  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirect: false,
  });

  redirect("/app/dashboard");
}
