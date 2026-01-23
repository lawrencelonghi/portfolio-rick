# Rick Tadeu Portfolio

A professional portfolio website for Rick Tadeu, Beauty Artist, featuring campaign galleries, multilingual support, and admin content management.

## Features

- **Campaign Galleries**: Responsive masonry layout with lightbox viewing for images and videos
- **Multilingual Support**: Portuguese and English translations using i18next
- **Admin Dashboard**: Secure content management system with drag-and-drop reordering
- **Profile Management**: Editable profile image and bilingual text content
- **Media Support**: Handles both images (JPEG, PNG, GIF, WebP, SVG) and videos (MP4, WebM, OGG, MOV)
- **Authentication**: JWT-based admin authentication system

## Tech Stack

### Frontend
- React 19
- React Router 7
- Tailwind CSS 4
- i18next (internationalization)
- yet-another-react-lightbox
- dnd-kit (drag and drop)
- AOS (animations)
- Vite 7

### Backend
- Node.js
- Express 5
- TypeScript
- Prisma ORM
- SQLite
- Multer (file uploads)
- JWT authentication
- bcryptjs (password hashing)

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/rick-portfolio.git
cd rick-portfolio
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

Create `.env` file in the server directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
PORT=3000
CLIENT_URL="http://localhost:5173"
```

### 4. Database Setup

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### 5. Create Admin User

```bash
npm run tsx src/utils/createAdmin.ts
```

Follow the prompts to create your admin username and password.

## Development

### Run the development servers:

```bash
# Terminal 1 - Backend server
cd server
npm run dev

# Terminal 2 - Frontend development server
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:3000`

## Production Build

### 1. Build the client

```bash
cd client
npm run build
```

### 2. Build the server

```bash
cd server
npm run build
```

### 3. Start production server

```bash
cd server
npm start
```

The application will serve the built React app and API from port 3000.

## Project Structure

```
.
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── api/            # Axios configuration
│   └── public/             # Static assets
│
└── server/                 # Express backend
    ├── src/
    │   ├── routes/         # API routes
    │   ├── middleware/     # Auth & upload middleware
    │   └── utils/          # Utility scripts
    ├── prisma/
    │   ├── schema.prisma   # Database schema
    │   └── migrations/     # Database migrations
    └── uploads/            # Uploaded media files
```

## API Endpoints

### Public Endpoints
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `GET /api/profile-image` - Get profile image
- `GET /api/profile-texts` - Get profile texts

### Protected Endpoints (require authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/imgVdos/campaign/:id` - Upload media
- `DELETE /api/imgVdos/:id` - Delete media
- `PUT /api/profile-image` - Update profile image
- `PUT /api/profile-texts` - Update profile texts

## Admin Panel

Access the admin panel at `/admin`

Features:
- Drag-and-drop campaign reordering
- Drag-and-drop media reordering within campaigns
- Set campaign thumbnail/cover image
- Upload multiple images/videos
- Edit campaign titles
- Delete campaigns and media
- Edit profile content (image and bilingual text)

## Deployment

### Environment Variables for Production

Update `.env.production` in the client directory:

```env
VITE_BACKEND_URL=https://your-production-domain.com
```

### Deployment Platforms

This application can be deployed to:
- Vercel (recommended for client)
- Railway, Render, or similar (for server + database)
- VPS with Docker

Ensure your production environment:
- Has Node.js 18+ installed
- Sets all required environment variables
- Runs database migrations
- Has write permissions for uploads directory

## License

ISC

## Developer

Developed by Lawrence Longhi
Portfolio: [lawrencelonghi.vercel.app](https://lawrencelonghi.vercel.app)