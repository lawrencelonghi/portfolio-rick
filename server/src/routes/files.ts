import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const router = Router();
const prisma = new PrismaClient();

const VIDEO_EXTENSIONS = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'ogg'];

interface ProcessedFile {
  filename: string;
  width: number | null;
  height: number | null;
}

// Processa imagem: converte para WebP, redimensiona e retorna dimensões
async function processImage(file: Express.Multer.File): Promise<ProcessedFile> {
  const ext = path.extname(file.filename).replace('.', '').toLowerCase();

  // Vídeos: não processa, só retorna
  if (VIDEO_EXTENSIONS.includes(ext)) {
    return { filename: file.filename, width: null, height: null };
  }

  // Imagens: converte para WebP
  const baseName = path.basename(file.filename, path.extname(file.filename));
  const webpFilename = baseName + '.webp';
  const webpPath = path.join('uploads', webpFilename);

  try {
    const metadata = await sharp(file.path)
      .webp({ quality: 82 })
      .resize({ width: 1920, withoutEnlargement: true })
      .toFile(webpPath);

    // Remove o arquivo original após conversão
    fs.unlinkSync(file.path);

    return {
      filename: webpFilename,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
    };
  } catch (err) {
    console.error('Erro ao converter imagem para WebP:', err);

    // Fallback: se falhar, usa o arquivo original e tenta ler as dimensões
    try {
      const meta = await sharp(file.path).metadata();
      return {
        filename: file.filename,
        width: meta.width ?? null,
        height: meta.height ?? null,
      };
    } catch {
      return { filename: file.filename, width: null, height: null };
    }
  }
}

// POST /api/imgVdos/campaign/:campaignId
router.post(
  '/campaign/:campaignId',
  authMiddleware,
  upload.array('imgVdos', 10),
  async (req: Request, res: Response) => {
    try {
      const { campaignId } = req.params;

      if (typeof campaignId !== 'string') {
        return res.status(400).json({ error: 'Invalid campaign id' });
      }

      if (!Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded' });
      }

      const files = req.files as Express.Multer.File[];

      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const lastImgVdo = await prisma.imgVdo.findFirst({
        where: { campaignId },
        orderBy: { order: 'desc' },
      });

      let currentOrder = lastImgVdo ? lastImgVdo.order + 1 : 0;

      const imgVdoPromises = files.map(async (file) => {
        const processed = await processImage(file);

        return prisma.imgVdo.create({
          data: {
            filename: processed.filename,
            path: `/uploads/${processed.filename}`,
            campaignId,
            order: currentOrder++,
            width: processed.width,
            height: processed.height,
          },
        });
      });

      const imgsVdos = await Promise.all(imgVdoPromises);

      return res.status(201).json({
        message: `${imgsVdos.length} imgVdo(s) enviada(s) com sucesso`,
        imgsVdos,
      });
    } catch (error) {
      console.error('Error when uploading imgsVdos:', error);
      return res.status(500).json({ error: 'Error when uploading imgsVdos' });
    }
  }
);

// DELETE /api/imgVdos/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid imgVdo ID' });
    }

    const imgVdo = await prisma.imgVdo.findUnique({
      where: { id },
      include: { campaign: true },
    });

    if (!imgVdo) {
      return res.status(404).json({ error: 'imgVdo not found' });
    }

    if (imgVdo.campaign.thumbnailId === id) {
      await prisma.campaign.update({
        where: { id: imgVdo.campaignId },
        data: { thumbnailId: null },
      });
    }

    const filePath = path.join(process.cwd(), 'uploads', imgVdo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.imgVdo.delete({
      where: { id },
    });

    return res.json({ message: 'imgVdo deleted successfully' });
  } catch (error) {
    console.error('Error when deleting imgVdo:', error);
    return res.status(500).json({ error: 'Error when deleting imgVdo' });
  }
});

// PUT /api/imgVdos/:id/order
router.put('/:id/order', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid imgVdo ID' });
    }

    if (typeof order !== 'number') {
      return res.status(400).json({ error: 'Invalid order' });
    }

    const imgVdo = await prisma.imgVdo.update({
      where: { id },
      data: { order },
    });

    return res.json(imgVdo);
  } catch (error) {
    console.error('error when updating imgVdo', error);
    return res.status(500).json({ error: 'error when updating imgVdo' });
  }
});

export default router;