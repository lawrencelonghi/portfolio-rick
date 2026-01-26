#!/bin/bash

# Script de diagnóstico do .env
# Uso: bash check-env.sh

echo "🔍 DIAGNÓSTICO DO ARQUIVO .ENV"
echo "=============================="
echo ""

# 1. Verificar se .env existe
echo "1️⃣ Verificando existência do .env..."
if [ -f ".env" ]; then
    echo "✅ .env encontrado"
    ls -lh .env
else
    echo "❌ .env NÃO encontrado!"
    echo "   Arquivos .env* na raiz:"
    ls -la | grep "\.env"
    exit 1
fi
echo ""

# 2. Mostrar conteúdo do .env (sem revelar secrets)
echo "2️⃣ Conteúdo do .env (parcial)..."
echo "---"
cat .env | sed 's/=.*/=***/' 
echo "---"
echo ""

# 3. Verificar variáveis específicas
echo "3️⃣ Verificando variáveis importantes..."
if grep -q "^JWT_SECRET=" .env; then
    JWT_LEN=$(grep "^JWT_SECRET=" .env | cut -d'=' -f2 | wc -c)
    echo "✅ JWT_SECRET encontrado (tamanho: $JWT_LEN caracteres)"
else
    echo "❌ JWT_SECRET NÃO encontrado!"
fi

if grep -q "^DATABASE_URL=" .env; then
    echo "✅ DATABASE_URL encontrado"
else
    echo "❌ DATABASE_URL NÃO encontrado!"
fi

if grep -q "^CLIENT_URL=" .env; then
    echo "✅ CLIENT_URL encontrado"
else
    echo "❌ CLIENT_URL NÃO encontrado!"
fi
echo ""

# 4. Testar se Docker Compose lê o .env
echo "4️⃣ Testando se Docker Compose lê o .env..."
TEST_VALUE=$(docker compose config 2>&1 | grep -o "JWT_SECRET" | head -1)
if [ -n "$TEST_VALUE" ]; then
    echo "✅ Docker Compose está lendo variáveis do .env"
else
    echo "⚠️  Docker Compose pode não estar lendo o .env"
fi
echo ""

# 5. Ver variáveis que o Docker Compose vai usar
echo "5️⃣ Variáveis de ambiente no docker-compose config..."
echo "---"
docker compose config | grep -A 10 "environment:" | head -20
echo "---"
echo ""

# 6. Verificar se há problema de formato
echo "6️⃣ Verificando formato do .env..."

# Linhas em branco
BLANK_LINES=$(grep -c "^$" .env || echo 0)
echo "Linhas em branco: $BLANK_LINES"

# Linhas com espaços antes do =
SPACE_LINES=$(grep -c " =" .env || echo 0)
if [ $SPACE_LINES -gt 0 ]; then
    echo "⚠️  Encontradas $SPACE_LINES linhas com espaços antes do '='"
    echo "   Exemplo: 'KEY = value' (errado) → 'KEY=value' (correto)"
fi

# Aspas
QUOTE_LINES=$(grep -c '"' .env || echo 0)
if [ $QUOTE_LINES -gt 0 ]; then
    echo "ℹ️  Encontradas $QUOTE_LINES linhas com aspas"
    echo "   Aspas são opcionais no .env"
fi
echo ""

# 7. Verificar se containers estão usando as variáveis
echo "7️⃣ Verificando variáveis DENTRO do container backend..."
if docker compose ps | grep -q "backend.*Up"; then
    echo "Backend está UP. Verificando variáveis..."
    echo "---"
    docker compose exec -T backend sh -c 'env | grep -E "^JWT_SECRET=|^DATABASE_URL=|^CLIENT_URL=|^PORT=|^NODE_ENV=" | sed "s/JWT_SECRET=.*/JWT_SECRET=***/"'
    echo "---"
else
    echo "❌ Backend NÃO está rodando!"
    echo "   Execute: docker compose up -d"
fi
echo ""

# 8. Verificar docker-compose.yml
echo "8️⃣ Verificando docker-compose.yml..."

if grep -q "^version:" docker-compose.yml; then
    echo "⚠️  docker-compose.yml ainda tem 'version:' (causa warning)"
    echo "   Remova com: sed -i '/^version:/d' docker-compose.yml"
else
    echo "✅ docker-compose.yml sem 'version:'"
fi

if grep -q '${JWT_SECRET}' docker-compose.yml; then
    echo "✅ docker-compose.yml usa \${JWT_SECRET}"
else
    echo "⚠️  docker-compose.yml pode não estar usando \${JWT_SECRET}"
fi
echo ""

# 9. Resumo e recomendações
echo "📊 RESUMO"
echo "========="

ENV_EXISTS=$([ -f ".env" ] && echo "✅" || echo "❌")
JWT_EXISTS=$(grep -q "^JWT_SECRET=" .env 2>/dev/null && echo "✅" || echo "❌")
DOCKER_READS=$(docker compose config 2>&1 | grep -q "JWT_SECRET" && echo "✅" || echo "❌")
BACKEND_UP=$(docker compose ps 2>/dev/null | grep -q "backend.*Up" && echo "✅" || echo "❌")

echo ".env existe:              $ENV_EXISTS"
echo "JWT_SECRET no .env:       $JWT_EXISTS"
echo "Docker lê .env:           $DOCKER_READS"
echo "Backend rodando:          $BACKEND_UP"
echo ""

# Recomendações
echo "📝 PRÓXIMOS PASSOS:"
echo ""

if [ "$ENV_EXISTS" != "✅" ]; then
    echo "1. Crie o arquivo .env na raiz do projeto"
fi

if [ "$DOCKER_READS" != "✅" ]; then
    echo "2. Reinicie os containers:"
    echo "   docker compose down"
    echo "   docker compose up -d"
fi

if [ "$BACKEND_UP" != "✅" ]; then
    echo "3. Inicie os containers:"
    echo "   docker compose up -d"
fi

echo ""
echo "4. Para aplicar mudanças no .env:"
echo "   docker compose down"
echo "   docker compose up -d"
echo ""
echo "5. Para criar admin:"
echo "   ./create-admin-inline.sh"