FROM node:20-slim

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar arquivos do servidor
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Instalar dependências do servidor
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código do servidor
COPY server/ ./

# Build TypeScript do servidor
RUN npm run build

# Criar diretório para uploads
RUN mkdir -p uploads

# Agora buildar o frontend
WORKDIR /app/client

# Copiar arquivos do frontend
COPY client/package*.json ./
RUN npm install

COPY client/ ./

# IMPORTANTE: Garantir que .env.production existe
# Se não existir no projeto, criar com valor padrão
RUN if [ ! -f .env.production ]; then \
      echo "VITE_BACKEND_URL=https://ricktadeu.com.br" > .env.production; \
    fi

# Build do frontend React/Vite (vai incluir as variáveis VITE_)
RUN npm run build

# Mover build do frontend para pasta public do backend
RUN mv dist /app/public

# Voltar para o diretório do backend
WORKDIR /app

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]