FROM node:20-alpine

WORKDIR /app

# Dependências
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# Código
COPY . .

# Build TS
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]