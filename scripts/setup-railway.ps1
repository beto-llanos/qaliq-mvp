# ─────────────────────────────────────────────────────────────────────────────
# Railway bootstrap script — run AFTER `railway login` and `railway init`.
#
# Creates the Postgres plugin (if missing), sets env vars, and reminds you
# of the manual steps (Volume + domain) that the CLI cannot do.
# ─────────────────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

Write-Host "▶ Verificando que railway está autenticado…" -ForegroundColor Cyan
railway whoami | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✖ No autenticado. Corre 'railway login' primero." -ForegroundColor Red
    exit 1
}

Write-Host "▶ Verificando que estás dentro de un proyecto…" -ForegroundColor Cyan
railway status | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✖ No hay proyecto vinculado. Corre 'railway init' primero." -ForegroundColor Red
    exit 1
}

Write-Host "▶ Generando AUTH_SECRET y seteando variables…" -ForegroundColor Cyan
$secret = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

railway variables --set "AUTH_SECRET=$secret"
railway variables --set "NODE_ENV=production"
railway variables --set "STORAGE_PATH=/data/storage"

Write-Host ""
Write-Host "✓ Variables configuradas." -ForegroundColor Green
Write-Host ""
Write-Host "Pasos manuales restantes (dashboard de Railway):" -ForegroundColor Yellow
Write-Host "  1. Settings → Volumes → New Volume, mount path /data/storage" -ForegroundColor Yellow
Write-Host "  2. Settings → Networking → Generate Domain" -ForegroundColor Yellow
Write-Host "  3. Copia el dominio y corre:" -ForegroundColor Yellow
Write-Host '     railway variables --set "AUTH_URL=https://<tu-dominio>"' -ForegroundColor Yellow
Write-Host "  4. Asegúrate de que el servicio Postgres existe:" -ForegroundColor Yellow
Write-Host "     railway add --database postgres" -ForegroundColor Yellow
Write-Host "  5. Deploy:" -ForegroundColor Yellow
Write-Host "     railway up" -ForegroundColor Yellow
Write-Host "  6. Una vez vivo, corre el seed:" -ForegroundColor Yellow
Write-Host "     railway run npm run db:seed" -ForegroundColor Yellow
