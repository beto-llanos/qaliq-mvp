# QALIQ — MVP

> **Tu ISO 9001, gestionada como un proyecto. No como un cajón de archivos.**

Plataforma SaaS multi-tenant para gestionar la norma ISO 9001 en MiPyMEs mexicanas:
catálogo de "debes" precargado, gestión documental con versionado, módulo de hallazgos
con flujo de cierre, y dashboard de cumplimiento.

---

## Estado

`v0.1.0` — Scaffolding inicial. En desarrollo activo.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend & API | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS 3 |
| Auth | Auth.js v5 (NextAuth) — Credentials + Google OAuth |
| ORM | Prisma 6 |
| Base de datos | PostgreSQL 16 |
| Storage de archivos | Railway Volume (MVP) → migrable a S3/R2 |
| Hosting | Railway |

## Alcance MVP

- ✅ Auth multi-tenant + roles (Admin / Operator / Editor / Viewer)
- ✅ Catálogo ISO 9001 con árbol de cláusulas y "debes" asignables
- ✅ Gestión documental con versionado y workflow de aprobación
- ✅ Módulo de hallazgos (captura → plan → aprobación → cierre)
- ✅ Dashboard de cumplimiento por cláusula
- ✅ Audit log append-only desde día 1

**Fuera del MVP:** IA/OCR, ISO 27001/22301, matriz de riesgos dinámica, KPIs
automáticos, capacitación, app móvil nativa.

---

## Desarrollo local

### Prerrequisitos
- Node.js ≥ 20
- PostgreSQL 14+ corriendo localmente (o usar Docker)

### Setup

```bash
git clone https://github.com/beto-llanos/qaliq-mvp.git
cd qaliq-mvp
npm install
cp .env.example .env
# Edita .env con tu DATABASE_URL y AUTH_SECRET
npm run db:push
npm run dev
```

App en http://localhost:3000

### Variables de entorno (ver `.env.example`)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `AUTH_SECRET` | Llave para firmar sesiones (generar con `openssl rand -base64 32`) |
| `AUTH_URL` | URL pública de la app (incluyendo protocolo) |
| `AUTH_GOOGLE_ID` | (Opcional) Client ID de Google OAuth |
| `AUTH_GOOGLE_SECRET` | (Opcional) Client secret de Google OAuth |
| `STORAGE_PATH` | Path donde se guardan los documentos (`/data/storage` en Railway) |

---

## Deploy en Railway

1. **Crear proyecto** y vincular este repo.
2. **Agregar plugin PostgreSQL** — Railway inyecta `DATABASE_URL` automáticamente.
3. **Crear un Volume** y montarlo en `/data/storage`.
4. **Setear variables**:
   - `AUTH_SECRET` (generar con `openssl rand -base64 32`)
   - `AUTH_URL` = URL pública del servicio
   - `STORAGE_PATH=/data/storage`
   - `NODE_ENV=production`
5. Deploy. El build corre `prisma generate && next build`; el start corre
   `prisma migrate deploy && next start`.

---

## Arquitectura

```
┌─────────────────────────────────────────┐
│  Next.js 15 (App Router, monolito)      │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ UI (RSC)    │  │ Server Actions  │   │
│  └─────────────┘  └─────────────────┘   │
│         │                  │             │
│         └────────┬─────────┘             │
│                  ▼                       │
│   src/lib/tenant.ts ── requireTenant()   │
│   src/lib/db.ts     ── Prisma client     │
│   src/lib/storage.ts── file adapter      │
└─────────────────────────────────────────┘
            │              │
            ▼              ▼
     ┌────────────┐  ┌────────────┐
     │ PostgreSQL │  │  Volume    │
     │ + RLS      │  │ /data/...  │
     └────────────┘  └────────────┘
```

### Multi-tenancy

- Cada entidad de negocio tiene `organizationId`
- `src/lib/tenant.ts:requireTenant()` resuelve el contexto y debe usarse en
  toda lectura/escritura desde código de servidor
- Postgres RLS se agrega como defensa en profundidad en migraciones posteriores

### Migración futura

- **Storage**: el adapter en `src/lib/storage.ts` se cambia por una
  implementación S3 (R2/AWS) sin tocar el resto de la app.
- **Hosting**: la app es Next.js estándar — portable a Vercel, AWS Amplify, etc.
- **Auth**: Auth.js v5 con adapter de Prisma — la sesión vive en la BD.

---

## Licencia

MIT — ver [LICENSE](./LICENSE).
