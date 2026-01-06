import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from "node:url";
import path from "node:path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client/dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'), 
 (error) => {
    if (error) {
      console.error('Error sending file:', error)
      if (!res.headersSent) {
        res.status(500).send('Internal server error')
      }
    }
  }
 )
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});