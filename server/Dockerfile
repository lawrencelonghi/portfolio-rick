FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build TypeScript
RUN npm run build

# Criar diretório para uploads
RUN mkdir -p uploads

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]