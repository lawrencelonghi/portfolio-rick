# ===============================
# 1) FRONTEND BUILD (Vite)
# ===============================
FROM node:20-slim AS frontend-build

WORKDIR /frontend

COPY client/package*.json ./
RUN npm install

COPY client .
RUN npm run build


# ===============================
# 2) BACKEND BUILD
# ===============================
FROM node:20-slim AS backend-build

WORKDIR /app

# deps
COPY server/package*.json ./
RUN npm install

# código
COPY server .

# prisma client (IMPORTANTE)
RUN npx prisma generate

# build TS
RUN npm run build


# ===============================
# 3) RUNTIME (PRODUÇÃO)
# ===============================
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

# só o necessário para runtime
COPY --from=backend-build /app/node_modules ./node_modules
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/prisma ./prisma
COPY --from=backend-build /app/package.json ./package.json

# frontend build → public
COPY --from=frontend-build /frontend/dist ./public

# uploads (volume)
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "dist/server.js"]
