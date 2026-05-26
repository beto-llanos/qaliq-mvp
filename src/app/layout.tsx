import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QALIQ — Gestión Inteligente ISO",
  description:
    "Plataforma para gestionar ISO 9001 en MiPyMEs: catálogo de debes, gestión documental, hallazgos y dashboard de cumplimiento.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
