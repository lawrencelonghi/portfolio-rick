# Stage 1: Build do Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copiar arquivos de dependências
COPY client/package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY client/ ./

# Build do frontend
RUN npm run build

# Stage 2: Build do Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

# Copiar arquivos de dependências
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY server/ ./

# Gerar Prisma Client
RUN npx prisma generate

# Build do backend
RUN npm run build

# Verificar se o build foi criado
RUN ls -la && echo "Checking dist folder:" && ls -la dist/ || echo "dist folder not found!"

# Stage 3: Imagem final de produção
FROM node:18-alpine

WORKDIR /app

# Instalar apenas dependências de runtime
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Instalar apenas prod dependencies
RUN npm ci --only=production && \
    npx prisma generate

# Copiar build do backend (ajustar caminho se necessário)
COPY --from=backend-builder /app/server/dist ./dist

# Copiar build do frontend para ser servido pelo backend
COPY --from=frontend-builder /app/client/dist ./client/dist

# Criar diretório para uploads
RUN mkdir -p uploads && chmod 755 uploads

# Expor porta
EXPOSE 3000

# Variáveis de ambiente (serão sobrescritas no docker-compose)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar
CMD ["node", "dist/server.js"]