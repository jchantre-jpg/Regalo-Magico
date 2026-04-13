# Despliegue VPS — Equipo 1 (puerto **3006**, dominio ele5-1.apolobyte.top)

Este proyecto es **Vite + React**; en producción se usa **`server.js`** (Express) en el puerto **3006** para cumplir la guía del curso. Nginx hace proxy al `3006`.

## Rama de desarrollo

- `dev-juliana-chantre` — trabajo diario.  
- Merge a `main` cuando quieras desplegar (el CI/CD reacciona solo a `main`).

## 1. Clonar en el VPS (como root)

```bash
cd /root
git clone https://github.com/jchantre-jpg/Regalo-Magico.git
cd Regalo-Magico
```

## 2. Instalar dependencias y compilar

```bash
npm install
npm run build
```

## 3. Probar en el puerto 3006

```bash
node server.js
```

En otra sesión SSH: `curl -sI http://127.0.0.1:3006` o abre en el servidor `http://localhost:3006`.

## 4. PM2 (dejar siempre activo)

```bash
npm install -g pm2
cd /root/Regalo-Magico
pm2 start server.js --name equipo1
pm2 save
pm2 startup
```

## 5. Nginx

```bash
nano /etc/nginx/sites-available/equipo1
```

Pegar (proxy al **3006**):

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

    access_log /var/log/nginx/equipo1.access.log;
    error_log /var/log/nginx/equipo1.error.log;
}
```

Activar y recargar:

```bash
ln -sf /etc/nginx/sites-available/equipo1 /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 6. HTTPS (Certbot)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d ele5-1.apolobyte.top
```

## 7. CI/CD (GitHub Actions)

En el repo: **Settings → Secrets and variables → Actions → New repository secret**:

| Nombre          | Valor                    |
|----------------|--------------------------|
| `VPS_HOST`     | `89.117.23.31`           |
| `VPS_USER`     | `root`                   |
| `VPS_PASSWORD` | Tu contraseña SSH (solo aquí, nunca en el código) |

Cada `git push` a **`main`** ejecuta: `git pull`, `npm ci`, `npm run build`, `pm2 restart equipo1`.

**No subas contraseñas al repositorio.** El workflow usa solo `${{ secrets.* }}`.
