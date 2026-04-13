# Despliegue VPS — Equipo 1 (puerto **3006**, dominio ele5-1.apolobyte.top)

Este proyecto es **Vite + React**; en producción se usa **`server.js`** (Express) en el puerto **3006**. Nginx hace proxy al `3006`.

- **PM2:** `equipo1-regalo_magico`
- **Nginx:** archivo `equipo1regalo_magico` en `sites-available`

## Rama de desarrollo

- `dev-juliana-chantre` — trabajo diario.
- Merge a `main` para desplegar (CI/CD solo en `main`).

---

## Desde Git Bash en Windows (lo que sí puedes hacer aquí)

Abre **Git Bash** y entra al proyecto (opcional, para empujar código):

```bash
cd "/c/Users/Juliana/OneDrive/Desktop/idea proyceto/regalo-magico"
git pull origin main
git status
```

**El VPS no se configura desde tu PC sin SSH.** El siguiente bloque lo ejecutas **ya conectada al servidor**.

---

## Conectar al VPS (Git Bash o PowerShell)

```bash
ssh root@89.117.23.31
```

(Pon tu contraseña o usa llave SSH.)

---

## Opción rápida: un solo script en el VPS

En el VPS, con el repo ya clonado o sin él (el script clona si falta):

```bash
cd /root/Regalo-Magico
# si aún no clonaste:
# git clone https://github.com/jchantre-jpg/Regalo-Magico.git && cd Regalo-Magico
git pull origin main
chmod +x scripts/vps-setup.sh
./scripts/vps-setup.sh
```

Eso hace: `git pull`, `npm ci`, `npm run build`, PM2 (`equipo1-regalo_magico`), crea y activa el sitio Nginx.

---

## Pasos manuales (igual que la guía del profe)

### 1. Clonar en el VPS (como root)

```bash
cd /root
git clone https://github.com/jchantre-jpg/Regalo-Magico.git
cd Regalo-Magico
```

### 2. Instalar dependencias y compilar

```bash
npm install
npm run build
```

### 3. Probar el puerto 3006

```bash
node server.js
```

En otra sesión SSH: `curl -sI http://127.0.0.1:3006` (Ctrl+C cierra el servidor de prueba).

### 4. PM2

```bash
npm install -g pm2
cd /root/Regalo-Magico
pm2 start server.js --name equipo1-regalo_magico
pm2 save
pm2 startup
```

### 5. Nginx

```bash
nano /etc/nginx/sites-available/equipo1regalo_magico
```

Pegar:

```nginx
server {
    listen 80;
    server_name ele5-1.apolobyte.top;

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    access_log /var/log/nginx/equipo1-regalo-magico.access.log;
    error_log /var/log/nginx/equipo1-regalo-magico.error.log;
}
```

Activar y recargar:

```bash
ln -sf /etc/nginx/sites-available/equipo1regalo_magico /etc/nginx/sites-enabled/equipo1regalo_magico
nginx -t
systemctl reload nginx
```

### 6. HTTPS (Certbot)

```bash
apt update
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ele5-1.apolobyte.top
```

### 7. CI/CD (GitHub Actions) — las 5 variables

En el repo: **Settings → Secrets and variables → Actions → New repository secret**

| Secreto | Qué poner |
|---------|-----------|
| **`SSH_HOST`** | IP del VPS, ej. `89.117.23.31` |
| **`SSH_PORT`** | `22` |
| **`SSH_PRIVATE_KEY`** | Todo el contenido de tu llave **privada** (`-----BEGIN ... PRIVATE KEY-----` … `-----END ...-----`). En el VPS debe estar la **pública** en `~/.ssh/authorized_keys`. |
| **`SSH_USER`** | `root` (o el usuario que use SSH) |
| **`WORK_DIR`** | Ruta del proyecto en el servidor: `/root/Regalo-Magico` |

Cada `push` a **`main`** ejecuta: `cd WORK_DIR`, `git pull`, `npm ci`, `npm run build`, `pm2 restart equipo1-regalo_magico`.

No pegues llaves ni contraseñas en el código YAML; solo en estos secretos.

