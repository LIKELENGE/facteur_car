FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=development
ENV DISPLAY=:99
ENV SCREEN_WIDTH=1280
ENV SCREEN_HEIGHT=800
ENV ELECTRON_DISABLE_SECURITY_WARNINGS=true

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        fluxbox \
        fonts-liberation \
        g++ \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libcups2 \
        libdbus-1-3 \
        libdrm2 \
        libgbm1 \
        libgtk-3-0 \
        libnss3 \
        libx11-xcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxkbcommon0 \
        libxrandr2 \
        libxss1 \
        libxtst6 \
        make \
        novnc \
        python3 \
        websockify \
        x11vnc \
        xdg-utils \
        xvfb \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma.config.ts ./
COPY .env ./
COPY prisma ./prisma

RUN npm install --no-audit --no-fund

COPY renderer/app/package*.json ./renderer/app/
RUN cd renderer/app && npm install --no-audit --no-fund

COPY tsconfig.json ./
COPY src ./src
COPY shared ./shared
COPY renderer/app ./renderer/app
COPY docs ./docs
COPY docker/entrypoint.sh /usr/local/bin/facteur-car-entrypoint

RUN chmod +x /usr/local/bin/facteur-car-entrypoint \
    && npx prisma generate \
    && npx prisma migrate deploy \
    && node prisma/seed.js \
    && npm run build \
    && chown -R node:node /app

USER node

EXPOSE 6080

ENTRYPOINT ["facteur-car-entrypoint"]
