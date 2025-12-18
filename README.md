# Rick Tadeu - Portfolio

Portfolio profissional de Rick Tadeu, Beauty Artist. Site desenvolvido com React + Django, apresentando trabalhos em fotografia, editorial, publicidade e audiovisual.

🌐 **Site ao vivo**: [ricktadeu.com.br](https://ricktadeu.com.br)

## 🚀 Tecnologias

### Frontend
- **React 19** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS 4** - Framework CSS utilitário
- **i18next** - Internacionalização (PT/EN)
- **yet-another-react-lightbox** - Galeria de imagens/vídeos
- **AOS** - Animações on scroll

### Backend
- **Django 5.2** - Framework Python
- **SQLite** - Banco de dados
- **Django CORS Headers** - Gerenciamento de CORS
- **Whitenoise** - Servir arquivos estáticos
- **Gunicorn** - WSGI server para produção
- **Pillow** - Processamento de imagens

### Infraestrutura
- **Docker** & **Docker Compose** - Containerização
- **HTTPS Portal** - SSL/TLS automático
- **DigitalOcean** - Hospedagem

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local sem Docker)
- Python 3.12+ (para desenvolvimento local sem Docker)

## 🛠️ Instalação e Desenvolvimento

### Opção 1: Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/rick-portfolio.git
cd rick-portfolio

# Configure as variáveis de ambiente
echo "SECRET_KEY=sua-chave-secreta-aqui" > server/.env
echo "DEBUG=True" >> server/.env

# Suba os containers de desenvolvimento
docker compose --profile dev up

# Acesse:
# Frontend: http://localhost:5173/static/
# Backend/Admin: http://localhost:8000/admin
```

### Opção 2: Desenvolvimento Local (Sem Docker)

**Backend:**
```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## 📱 Testar no Celular

Para testar no celular durante o desenvolvimento:

```bash
# Descubra o IP da sua máquina
hostname -I | awk '{print $1}'

# Edite client/.env.development com seu IP
# VITE_BACKEND_URL=http://SEU_IP:8000

# Reinicie os containers
docker compose --profile dev down
docker compose --profile dev up

# No celular (mesma rede WiFi), acesse:
# http://SEU_IP:5173/static/
```

## 🚢 Deploy para Produção

### DigitalOcean (ou qualquer VPS)

```bash
# No servidor, clone o repositório
git clone https://github.com/seu-usuario/rick-portfolio.git
cd rick-portfolio

# Configure as variáveis de ambiente
nano server/.env
# SECRET_KEY=sua-chave-secreta-forte
# DEBUG=False

# Suba os containers de produção
docker compose --profile prod up -d

# O site estará disponível em:
# http://seu-dominio.com
```

### Atualizar Produção

```bash
# No servidor
cd rick-portfolio
git pull origin main
docker compose --profile prod down
docker compose --profile prod build --no-cache
docker compose --profile prod up -d
```

## 📂 Estrutura do Projeto

```
rick-portfolio/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── Navbar.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   └── sections/
│   │   │       ├── Work.jsx
│   │   │       ├── About.jsx
│   │   │       └── Contact.jsx
│   │   ├── i18n.js         # Configuração de idiomas
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/             # Arquivos estáticos
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Django
│   ├── config/             # Configurações Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── portfolio/          # App principal
│   │   ├── models.py       # Modelo Work
│   │   ├── views.py        # API endpoints
│   │   ├── admin.py        # Admin Django
│   │   └── urls.py
│   ├── media/              # Upload de imagens/vídeos
│   ├── db/                 # Banco SQLite
│   ├── manage.py
│   └── requirements.txt
│
├── docker-compose.yml      # Orquestração Docker
└── README.md
```

## 🔧 Comandos Úteis

```bash
# Ver logs dos containers
docker compose --profile dev logs -f

# Acessar shell do Django
docker compose --profile dev exec backend_dev python manage.py shell

# Criar superusuário
docker compose --profile dev exec backend_dev python manage.py createsuperuser

# Fazer migrações
docker compose --profile dev exec backend_dev python manage.py makemigrations
docker compose --profile dev exec backend_dev python manage.py migrate

# Parar containers
docker compose --profile dev down

# Rebuild completo
docker compose --profile dev build --no-cache
```

## 🌍 Internacionalização

O site suporta dois idiomas:
- **Português (PT)** - padrão
- **Inglês (EN)**

Os arquivos de tradução estão em `client/src/i18n.js`.

## 📸 Gerenciamento de Conteúdo

1. Acesse o painel admin: `http://localhost:8000/admin`
2. Faça login com as credenciais de superusuário
3. Adicione, edite ou remova trabalhos na seção "Works"
4. Faça upload de imagens ou vídeos
5. As mudanças aparecem instantaneamente no frontend

## 🐛 Troubleshooting

### Imagens não aparecem no frontend

```bash
# Verifique se o backend está respondendo
curl http://localhost:8000/api/works/

# Verifique as variáveis de ambiente
docker compose --profile dev exec client_dev printenv | grep VITE
```

### Porta já em uso

```bash
# Mate o processo na porta 5173
sudo kill -9 $(sudo lsof -t -i:5173)

# Ou porta 8000
sudo kill -9 $(sudo lsof -t -i:8000)
```

### Permissões em media/

```bash
sudo chmod -R 777 server/media/
```

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados © 2025 Rick Tadeu.

## 👤 Autor

**Rick Tadeu**
- Website: [ricktadeu.com.br](https://ricktadeu.com.br)
- Instagram: [@rick_makeup](https://www.instagram.com/rick_makeup/)
- Email: makeup.rick@gmail.com

## 🤝 Contribuindo

Este é um projeto privado. Para sugestões ou reportar bugs, entre em contato diretamente.
