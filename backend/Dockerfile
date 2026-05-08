# Imagen del API (Express + pg). El compose publica 8086→8085 en el host por defecto.
# Solo dependencias de producción; el código vive en backend/src/index.js.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
# Puerto interno del contenedor (coincide con proxy_pass en nginx.conf del frontend).
EXPOSE 8085

CMD ["node", "src/index.js"]
