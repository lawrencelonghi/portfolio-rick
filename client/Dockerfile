# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine

# Copiar build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remover configuração padrão
RUN rm -f /etc/nginx/conf.d/default.conf.default

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]