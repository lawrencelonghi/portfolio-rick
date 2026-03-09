// Script para popular width/height de imagens já existentes no banco
// Execute uma vez: npx ts-node backfill-dimensions.ts
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const VIDEO_EXTENSIONS = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'ogg'];

async function main() {
  const imgVdos = await prisma.imgVdo.findMany({
    where: { width: null },
  });

  console.log(`Processando ${imgVdos.length} arquivos sem dimensões...`);

  for (const imgVdo of imgVdos) {
    const ext = path.extname(imgVdo.filename).replace('.', '').toLowerCase();
    if (VIDEO_EXTENSIONS.includes(ext)) continue;

    const filePath = path.join(process.cwd(), 'uploads', imgVdo.filename);
    if (!fs.existsSync(filePath)) {
      console.log(`Arquivo não encontrado: ${imgVdo.filename}`);
      continue;
    }

    try {
      const metadata = await sharp(filePath).metadata();
      if (metadata.width && metadata.height) {
        await prisma.imgVdo.update({
          where: { id: imgVdo.id },
          data: { width: metadata.width, height: metadata.height },
        });
        console.log(`✓ ${imgVdo.filename} → ${metadata.width}×${metadata.height}`);
      }
    } catch (err) {
      console.error(`✗ ${imgVdo.filename}:`, err);
    }
  }

  console.log('Concluído.');
  await prisma.$disconnect();
}

main();