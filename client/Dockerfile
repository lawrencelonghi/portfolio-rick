# Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage de produção - servidor estático simples
FROM node:20-alpine

WORKDIR /app

# Instalar servidor estático
RUN npm install -g serve

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 5173

# Comando para servir a aplicação
CMD ["serve", "-s", "dist", "-l", "5173"]