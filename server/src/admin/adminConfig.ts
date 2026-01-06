// src/admin/adminConfig.ts
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/sql';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Registrar o adapter SQL
AdminJS.registerAdapter({
  Database,
  Resource,
});

// Função para criar a conexão do AdminJS
export const setupAdmin = async () => {
  // Criar pool de conexão do PostgreSQL
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'portfolio_db',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  // Conectar ao banco e obter os metadados
  const db = await Database.init(pool);

  // Pegar os recursos das tabelas
  const campaigns = db.tables.find((table: any) => table.tableName === 'campaigns');
  const campaignImages = db.tables.find((table: any) => table.tableName === 'campaign_images');

  // Configurar recursos
  const adminOptions = {
    resources: [
      {
        resource: new Resource(campaigns),
        options: {
          navigation: {
            name: 'Portfolio',
            icon: 'Camera',
          },
          properties: {
            id: { 
              isVisible: { edit: false, show: true, list: true, filter: true } 
            },
            title: { 
              isTitle: true,
              isRequired: true,
              label: 'Título da Campanha',
            },
            thumb_url: {
              type: 'string' as const,
              label: 'URL da Thumbnail',
              description: 'Imagem principal que aparecerá na homepage',
            },
            order_index: {
              type: 'number' as const,
              label: 'Ordem de Exibição',
              description: 'Ordem em que aparece na homepage (menor = primeiro)',
            },
          },
        },
      },
      {
        resource: new Resource(campaignImages),
        options: {
          navigation: {
            name: 'Portfolio',
            icon: 'Image',
          },
          properties: {
            id: { 
              isVisible: { edit: false, show: true, list: true, filter: true } 
            },
            campaign_id: {
              isRequired: true,
              label: 'Campanha',
              reference: 'campaigns',
            },
            image_url: {
              type: 'string' as const,
              isRequired: true,
              label: 'URL da Imagem',
            },
            order_index: {
              type: 'number' as const,
              label: 'Ordem',
              description: 'Ordem em que aparece no modal (menor = primeiro)',
            },
          },
        },
      },
    ],
    rootPath: '/admin',
    branding: {
      companyName: 'Rick Portfolio Admin',
      withMadeWithLove: false,
    },
  };

  const admin = new AdminJS(adminOptions);

  // Autenticação
  const authenticate = async (email: string, password: string) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'senha123';

    if (email === adminEmail && password === adminPassword) {
      return { email, role: 'admin' };
    }
    return null;
  };

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: process.env.SESSION_SECRET || 'mude-isso-por-algo-super-secreto',
    },
    null,
    {
      secret: process.env.SESSION_SECRET || 'mude-isso-por-algo-super-secreto',
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
      },
    }
  );

  return { admin, adminRouter };
};