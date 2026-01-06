import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import Adapter, { Database, Resource } from '@adminjs/sql';
import dotenv from 'dotenv';
import { campaignUploadFeature, galleryUploadFeature, componentLoader } from './uploadFeature.js';

dotenv.config();

AdminJS.registerAdapter({
  Database,
  Resource,
});

export const setupAdmin = async () => {
  const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'portfolio_db'}`;

  const db = await new Adapter('postgresql', {
    connectionString,
    database: process.env.DB_NAME || 'portfolio_db',
  }).init();

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
              isVisible: { list: true, filter: false, show: true, edit: false },
            },
            thumb_file: {
              isVisible: { list: false, filter: false, show: false, edit: true },
            },
            thumb_path: {
              isVisible: false,
            },
            thumb_to_delete: {
              isVisible: false,
            },
            order_index: {
              description: 'Menor número aparece primeiro',
            },
          },
          listProperties: ['id', 'title', 'thumb_url', 'order_index'],
          showProperties: ['id', 'title', 'thumb_url', 'order_index'],
          editProperties: ['title', 'thumb_file', 'order_index'],
          filterProperties: ['title'],
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
              // Configuração correta para relacionamento
              type: 'reference',
              reference: 'campaigns',
              // Importante: mostrar no edit para poder selecionar
              isVisible: { list: true, filter: true, show: true, edit: true },
            },
            image_url: {
              isVisible: { list: true, filter: false, show: true, edit: false },
            },
            image_file: {
              isVisible: { list: false, filter: false, show: false, edit: true },
            },
            image_path: {
              isVisible: false,
            },
            image_to_delete: {
              isVisible: false,
            },
            order_index: {
              description: 'Ordem de exibição (menor = primeiro)',
            },
          },
          listProperties: ['id', 'campaign_id', 'image_url', 'order_index'],
          showProperties: ['id', 'campaign_id', 'image_url', 'order_index'],
          editProperties: ['campaign_id', 'image_file', 'order_index'],
          filterProperties: ['campaign_id'],
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

  if (process.env.NODE_ENV !== 'production') {
    admin.watch();
  }

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
        maxAge: 1000 * 60 * 60 * 24,
      },
    }
  );

  return { admin, adminRouter };
};