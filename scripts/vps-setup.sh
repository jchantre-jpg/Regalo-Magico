#!/usr/bin/env bash
# Ejecutar EN EL VPS como root (después de: ssh root@89.117.23.31)
# Opción A: bash <(curl -sL URL_RAW)   Opción B: copiar este archivo y chmod +x vps-setup.sh && ./vps-setup.sh
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/jchantre-jpg/Regalo-Magico.git}"
APP_DIR="/root/Regalo-Magico"
PM2_NAME="equipo1-regalo_magico"
# Mismo criterio que la guía del curso (web_ele5_3 → equipo 1 = web_ele5_1)
NGINX_CONF="web_ele5_1"
DOMAIN="ele5-1.apolobyte.top"
PORT=3006

echo "==> 1. Clonar / actualizar repo"
mkdir -p /root
cd /root
if [[ ! -d Regalo-Magico/.git ]]; then
  git clone "$REPO_URL" Regalo-Magico
fi
cd "$APP_DIR"
git pull origin main

echo "==> 2. Dependencias y build (Node 22+ recomendado)"
command -v node >/dev/null || { echo "Instala Node.js 22+ primero."; exit 1; }
npm ci
npm run build

echo "==> 3. PM2"
command -v pm2 >/dev/null || npm install -g pm2
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 restart "$PM2_NAME"
else
  pm2 start server.js --name "$PM2_NAME"
fi
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "==> 4. Nginx (sitio $NGINX_CONF → 127.0.0.1:$PORT)"
cat >"/etc/nginx/sites-available/$NGINX_CONF" <<NGINX_EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    access_log /var/log/nginx/ele5-1.access.log;
    error_log /var/log/nginx/ele5-1.error.log;
}
NGINX_EOF

ln -sf "/etc/nginx/sites-available/$NGINX_CONF" "/etc/nginx/sites-enabled/$NGINX_CONF"
nginx -t
systemctl reload nginx

echo ""
echo "✅ Listo: app en puerto $PORT, Nginx en 80 → $DOMAIN"
echo "   Prueba: curl -sI http://127.0.0.1:$PORT"
echo ""
echo "🔒 HTTPS (interactivo, ejecútalo tú):"
echo "   apt update && apt install -y certbot python3-certbot-nginx"
echo "   certbot --nginx -d $DOMAIN"
