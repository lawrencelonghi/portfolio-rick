import type { FeatureType } from 'adminjs';
import uploadFeature from '@adminjs/upload';
import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();

// Criar diretórios se não existirem
const uploadsDir = path.join(__dirname, '../../public/uploads');
const campaignsDir = path.join(uploadsDir, 'campaigns');
const galleryDir = path.join(uploadsDir, 'gallery');

[uploadsDir, campaignsDir, galleryDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuração para upload de thumbnail das campanhas
export const campaignUploadFeature: FeatureType = uploadFeature({
  componentLoader,
  provider: {
    local: {
      bucket: campaignsDir,
      opts: {
        baseUrl: '/uploads/campaigns',
      },
    },
  },
  properties: {
    key: 'thumb_url',
    file: 'thumb_file',
    filePath: 'thumb_path',
    filesToDelete: 'thumb_to_delete',
  },
  validation: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'],
  },
});

// Configuração para upload de imagens das galerias
export const galleryUploadFeature: FeatureType = uploadFeature({
  componentLoader,
  provider: {
    local: {
      bucket: galleryDir,
      opts: {
        baseUrl: '/uploads/gallery',
      },
    },
  },
  properties: {
    key: 'image_url',
    file: 'image_file',
    filePath: 'image_path',
    filesToDelete: 'image_to_delete',
  },
  validation: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'],
  },
});

export { componentLoader };