# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com servidor simples
FROM node:20-alpine

WORKDIR /app

# Instalar serve para servir arquivos estáticos
RUN npm install -g serve

# Copiar build do estágio anterior
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["serve", "-s", "dist", "-l", "3001"]