import express from "express"
import dotenv from "dotenv"
import path from "path";
import cors from "cors"
import authRoutes from './routes/auth.js'
import campaignRoutes from './routes/campaigns.js';
import imageRoutes from './routes/images.js';
import profileImageRoute from './routes/profile-image.js';


dotenv.config()

const __dirname = path.resolve();

const PORT = process.env.PORT

const app = express()

//middlewares below

//serve frontend static files
app.use(express.static(path.join(__dirname, "../client/dist")))
//serve static images files
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // URL do frontend React
  credentials: true
}));

//test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/images', imageRoutes);
app.use('/api/profile-image', profileImageRoute);


app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
})

