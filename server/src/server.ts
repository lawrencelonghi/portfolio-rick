import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import campaignRoutes from "./routes/campaigns.js";
import filesRoute from "./routes/files.js";
import profileImageRoute from "./routes/profile-image.js";
import profileTextsRoute from "./routes/profile-texts.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// dirname compatível com ESModules
const __dirname = path.resolve();

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ricktadeu.com.br",
    ],
    credentials: true,
  })
);

/* ----------------- Middlewares ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ----------------- Uploads ------------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------- API --------------------- */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/imgVdos", filesRoute);
app.use("/api/profile-image", profileImageRoute);
app.use("/api/profile-texts", profileTextsRoute);

/* -------------- FRONTEND (SPA) --------------- */

// arquivos estáticos do Vite
app.use(express.static(path.join(__dirname, "public")));

// fallback SPA — ⚠️ DEPOIS da API
app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ----------------- Start --------------------- */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
