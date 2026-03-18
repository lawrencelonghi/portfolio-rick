// Script para gerar thumbnails leves (thumb_) para imagens já existentes
// Execute uma vez: npx ts-node src/scripts/backfill-thumbs.ts
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const VIDEO_EXTENSIONS = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'ogg'];

async function main() {
  const files = fs.readdirSync(UPLOADS_DIR);

  // Apenas arquivos que NÃO são thumbs e NÃO são vídeos
  const images = files.filter((f) => {
    if (f.startsWith('thumb_')) return false;
    const ext = path.extname(f).replace('.', '').toLowerCase();
    return !VIDEO_EXTENSIONS.includes(ext);
  });

  console.log(`Gerando thumbnails para ${images.length} imagens...`);

  for (const filename of images) {
    const thumbFilename = 'thumb_' + filename;
    const thumbPath = path.join(UPLOADS_DIR, thumbFilename);

    if (fs.existsSync(thumbPath)) {
      console.log(`  ⏭  ${filename} (thumb já existe)`);
      continue;
    }

    const srcPath = path.join(UPLOADS_DIR, filename);

    try {
      await sharp(srcPath)
        .webp({ quality: 55 })
        .resize({ width: 600, withoutEnlargement: true })
        .toFile(thumbPath);
      console.log(`  ✓  ${filename}`);
    } catch (err) {
      console.error(`  ✗  ${filename}:`, err);
    }
  }

  console.log('Concluído.');
}

main();