import express from "express"
import dotenv from "dotenv"
import path from "path";
import cors from "cors"
import authRoutes from './routes/auth.js'
import campaignRoutes from './routes/campaigns.js';
import filesRoute from './routes/files.js';
import profileImageRoute from './routes/profile-image.js';
import profileTextsRoute from './routes/profile-texts.js';

dotenv.config()

const __dirname = path.resolve();
const PORT = parseInt(process.env.PORT || '3000', 10)

const app = express()

// CORS configurado para aceitar requisições do frontend
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://ricktadeu.com.br",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Rotas da API
app.use('/api/auth', authRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/imgVdos', filesRoute);
app.use('/api/profile-image', profileImageRoute);
app.use('/api/profile-texts', profileTextsRoute);

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
})