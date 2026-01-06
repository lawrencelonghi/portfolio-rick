import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import Adapter, { Database, Resource } from '@adminjs/sql';
import dotenv from 'dotenv';
import { campaignUploadFeature, galleryUploadFeature, componentLoader } from './uploadFeature.js';

dotenv.config();

// Registrar o adapter SQL
AdminJS.registerAdapter({
  Database,
  Resource,
});

export const setupAdmin = async () => {
  // Criar connection string do PostgreSQL
  const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'portfolio_db'}`;

  // Conectar ao banco usando Adapter
  const db = await new Adapter('postgresql', {
    connectionString,
    database: process.env.DB_NAME || 'portfolio_db',
  }).init();

  // Configurar recursos usando db.table()
  const adminOptions = {
    componentLoader,
    resources: [
      {
        resource: db.table('campaigns'),
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
            },
            thumb_url: {
              isVisible: { list: false, filter: false, show: true, edit: false },
            },
            order_index: {
              description: 'Menor número aparece primeiro',
            },
          },
          listProperties: ['id', 'title', 'order_index'],
          showProperties: ['id', 'title', 'thumb_url', 'order_index'],
          editProperties: ['title', 'order_index'],
          filterProperties: ['title'],
          actions: {
            edit: {
              after: async (response: any) => {
                return response;
              },
            },
          },
        },
        features: [campaignUploadFeature],
      },
      {
        resource: db.table('campaign_images'),
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
              reference: 'campaigns',
            },
            image_url: {
              isVisible: { list: false, filter: false, show: true, edit: false },
            },
            order_index: {
              description: 'Ordem de exibição (menor = primeiro)',
            },
          },
          listProperties: ['id', 'campaign_id', 'order_index'],
          showProperties: ['id', 'campaign_id', 'image_url', 'order_index'],
          editProperties: ['campaign_id', 'order_index'],
          filterProperties: ['campaign_id'],
          actions: {
            edit: {
              after: async (response: any) => {
                return response;
              },
            },
          },
        },
        features: [galleryUploadFeature],
      },
    ],
    rootPath: '/admin',
    branding: {
      companyName: 'Rick Tadeu - Portfolio Admin',
      withMadeWithLove: false,
    },
  };

  const admin = new AdminJS(adminOptions);

  // Adicionar watch para desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    admin.watch();
  }

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