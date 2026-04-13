# Despliegue VPS — Equipo 1 (puerto **3006**, dominio ele5-1.apolobyte.top)

Este proyecto es **Vite + React**; en producción se usa **`server.js`** (Express) en el puerto **3006**. Nginx hace proxy al `3006`.

- **PM2:** `equipo1-regalo_magico`
- **Nginx (equipo 1):** archivo `web_ele5_1` en `sites-available` (misma lógica que la pizarra `web_ele5_3`, con **tu** dominio y **puerto 3006**)

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

### 5. Nginx — como en la pizarra del profe (adaptado equipo **1**, puerto **3006**)

En el ejemplo del curso usan `web_ele5_3` + puerto `3002` + otro dominio. **Tú** usas:

| En el ejemplo (otro equipo) | Equipo 1 — Regalo Mágico |
|----------------------------|---------------------------|
| `web_ele5_3` | **`web_ele5_1`** |
| `3002` | **`3006`** |
| `openproject.apolobyte.top` | **`ele5-1.apolobyte.top`** |
| `ele5-3.apolobyte.to` en certbot | **`ele5-1.apolobyte.top`** |

**1)** Crear/editar el sitio (elige una):

```bash
# Si en el VPS tienes VS Code / code:
sudo code /etc/nginx/sites-available/web_ele5_1

# Si no (lo normal en servidor):
sudo nano /etc/nginx/sites-available/web_ele5_1
```

**2)** Pegar esta configuración (proxy a tu app en **3006**):

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

    access_log /var/log/nginx/ele5-1.access.log;
    error_log /var/log/nginx/ele5-1.error.log;
}
```

**3)** Enlace a `sites-enabled` — el nombre **debe ser el mismo** que en `sites-available` (en la pizarra a veces fallan por poner otro nombre):

```bash
sudo ln -sf /etc/nginx/sites-available/web_ele5_1 /etc/nginx/sites-enabled/web_ele5_1
```

**4)** Verificar y recargar:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

**5)** Certificado SSL (dominio **tuyo**, no el del ejemplo):

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ele5-1.apolobyte.top
```

(Antes, el DNS de `ele5-1.apolobyte.top` debe apuntar a la IP del VPS.)

Si en el VPS ya tenías otro archivo (por ejemplo `equipo1regalo_magico`) apuntando al mismo dominio, desactiva el enlace viejo para evitar conflictos: `sudo rm /etc/nginx/sites-enabled/equipo1regalo_magico` y luego `sudo nginx -t && sudo systemctl reload nginx`.

### 6. CI/CD (GitHub Actions) — las 5 variables

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

