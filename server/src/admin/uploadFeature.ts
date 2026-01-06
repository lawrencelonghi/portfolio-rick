import type { FeatureType } from 'adminjs';
import uploadFeature from '@adminjs/upload';
import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();

// Configuração para upload de thumbnail das campanhas
export const campaignUploadFeature: FeatureType = uploadFeature({
  componentLoader,
  provider: {
    local: {
      bucket: path.join(__dirname, '../../public/uploads/campaigns'),
      opts: {
        baseUrl: '/uploads/campaigns',
      },
    },
  },
  properties: {
    key: 'thumb_url',
    file: 'thumb_file',
  },
  uploadPath: (record: any, filename: string) => {
    const timestamp = Date.now();
    const ext = path.extname(filename);
    return `campaign-${record.id || timestamp}${ext}`;
  },
});

// Configuração para upload de imagens das galerias
export const galleryUploadFeature: FeatureType = uploadFeature({
  componentLoader,
  provider: {
    local: {
      bucket: path.join(__dirname, '../../public/uploads/gallery'),
      opts: {
        baseUrl: '/uploads/gallery',
      },
    },
  },
  properties: {
    key: 'image_url',
    file: 'image_file',
  },
  uploadPath: (record: any, filename: string) => {
    const timestamp = Date.now();
    const ext = path.extname(filename);
    return `gallery-${record.id || timestamp}${ext}`;
  },
});

export { componentLoader };