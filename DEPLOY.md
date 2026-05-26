# Deploy a Railway

Guía paso a paso para llevar QALIQ MVP a producción en Railway.

## Prerrequisitos

- [Cuenta de Railway](https://railway.app)
- Railway CLI instalado: `npm i -g @railway/cli` (ya tienes la 4.42.1)
- Plan Hobby o Pro (los volúmenes requieren plan pagado)

---

## 1. Login

```powershell
railway login
```

Abrirá tu navegador para autenticar. Confirma y vuelve a la terminal.

Verifica:

```powershell
railway whoami
```

---

## 2. Crear el proyecto y vincularlo a este repo

Desde la carpeta del proyecto:

```powershell
cd C:\Users\betit\Desktop\qaliq-mvp
railway init
```

Cuando pregunte:
- **Project name:** `qaliq-mvp`
- **Team:** tu workspace personal (o el que prefieras)

Esto crea el proyecto vacío.

---

## 3. Agregar PostgreSQL

```powershell
railway add --database postgres
```

Railway crea el servicio Postgres y lo deja corriendo. Inyecta `DATABASE_URL`
automáticamente como variable referencia en los demás servicios del proyecto.

---

## 4. Crear el servicio web (la app)

```powershell
railway up
```

Esto sube el código actual del directorio. Railway detecta `railway.json` y
usa Nixpacks. El primer deploy va a tardar 2-4 minutos (instala deps, corre
`prisma generate` + `next build`).

> Si prefieres deploy continuo desde GitHub:
> 1. Ve al dashboard de Railway → tu proyecto
> 2. New → GitHub Repo → `beto-llanos/qaliq-mvp`
> 3. Listo. Cada push a `main` despliega.

---

## 5. Configurar las variables de entorno del servicio web

En el dashboard del servicio web (no del Postgres), tab **Variables**, agrega:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `AUTH_SECRET` | (generar abajo) |
| `AUTH_URL` | URL pública del servicio (ej. `https://qaliq-mvp.up.railway.app`) |
| `STORAGE_PATH` | `/data/storage` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referencia) |

Genera `AUTH_SECRET`:

```powershell
# En PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

O por CLI:

```powershell
$secret = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
railway variables --set "AUTH_SECRET=$secret"
railway variables --set "NODE_ENV=production"
railway variables --set "STORAGE_PATH=/data/storage"
# AUTH_URL: lo seteas DESPUÉS de generar el dominio (paso 7)
```

---

## 6. Crear y montar el Volume

Desde el dashboard del servicio web:

1. Tab **Settings** → sección **Volumes** → **+ New Volume**
2. **Mount Path:** `/data/storage`
3. **Size:** 5 GB (suficiente para empezar; escalable)
4. **Save**

El servicio se reinicia automáticamente con el volume montado.

> **Nota de costos:** los volúmenes en Hobby empiezan en $0.25/GB/mes.

---

## 7. Generar el dominio público

1. Dashboard del servicio web → tab **Settings** → **Networking**
2. **Generate Domain** → toma el dominio (ej. `qaliq-mvp-production.up.railway.app`)
3. Vuelve a Variables y actualiza:
   - `AUTH_URL=https://qaliq-mvp-production.up.railway.app`

---

## 8. Correr migraciones y seed

Las migraciones corren automáticamente en el start command (`prisma migrate deploy`).

Para el seed inicial del catálogo ISO 9001:

```powershell
railway run npm run db:seed
```

Esto se conecta a la BD de producción y carga las ~60 cláusulas.

---

## 9. Verificar

Abre el dominio. Deberías ver la landing. Prueba:

1. Click en **Registra tu organización** → crea cuenta
2. Te lleva a `/app/dashboard`
3. Ve a **Normatividad** y confirma que se ven los capítulos 4-10

---

## Comandos útiles

```powershell
# Ver logs en tiempo real
railway logs --service web

# Abrir una shell en el contenedor (debug)
railway shell

# Correr un comando en producción
railway run npm run db:studio

# Ver todas las variables actuales
railway variables

# Conectarte a la BD de Postgres
railway connect postgres
```

---

## Troubleshooting

**Build falla con `prisma generate`** → verifica que `DATABASE_URL` esté
configurada antes del primer deploy.

**Auth.js falla con `MissingSecret`** → `AUTH_SECRET` no está seteado.

**Volume no se monta** → revisa que el `Mount Path` sea exactamente
`/data/storage` y que la variable `STORAGE_PATH` apunte al mismo path.

**Login redirige a `localhost`** → `AUTH_URL` no fue actualizada después de
generar el dominio. Actualízala y redeploy.
