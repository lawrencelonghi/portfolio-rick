import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createTables, pool } from './db/database.js';
import { setupAdmin } from './admin/adminConfig.js';
import worksRouter from './routes/works.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir arquivos de upload como estáticos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Inicializar banco de dados e AdminJS
const initializeApp = async () => {
  try {
    // Criar tabelas
    await createTables();
    console.log('✓ Banco de dados inicializado');

    // Configurar AdminJS
    const { admin, adminRouter } = await setupAdmin();
    app.use(admin.options.rootPath, adminRouter);
    console.log(`✓ AdminJS disponível em http://localhost:${PORT}${admin.options.rootPath}`);

    // Rotas da API
    app.use('/api/works', worksRouter);

    // Em desenvolvimento, redirecionar para o Vite dev server
    if (process.env.NODE_ENV !== 'production') {
      app.get('/', (req, res) => {
        res.redirect('http://localhost:5173');
      });
    } else {
      // Em produção, servir arquivos estáticos
      app.use(express.static(path.join(__dirname, '../../client/dist')));
      
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'), 
          (error) => {
            if (error) {
              console.error('Error sending file:', error);
              if (!res.headersSent) {
                res.status(500).send('Internal server error');
              }
            }
          }
        );
      });
    }

    app.listen(PORT, () => {
      console.log(`✓ Server rodando em http://localhost:${PORT}`);
      console.log(`✓ AdminJS: http://localhost:${PORT}/admin`);
      console.log(`✓ API: http://localhost:${PORT}/api/works`);
    });

  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

initializeApp();