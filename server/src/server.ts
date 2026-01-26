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
const PORT = process.env.PORT || 3000

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API Routes (must come BEFORE static file serving)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/imgVdos', filesRoute);
app.use('/api/profile-image', profileImageRoute);
app.use('/api/profile-texts', profileTextsRoute);

// Serve static files from React build
app.use(express.static(path.join(__dirname, "client/dist")))

// SPA fallback - serve index.html for all non-API routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})