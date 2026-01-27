# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Copiar schema do Prisma
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar o Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação TypeScript
RUN npm run build

# Stage de produção
FROM node:20-alpine

WORKDIR /app

# Copiar package.json para instalar apenas dependências de produção
COPY package*.json ./

# Copiar schema do Prisma
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm install --only=production



# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["node", "dist/server.js"]