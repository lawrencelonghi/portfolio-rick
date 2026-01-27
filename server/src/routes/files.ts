import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// POST /api/campaign/:campaignId
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
        files.forEach(file => fs.unlinkSync(file.path));
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const lastImgVdo = await prisma.imgVdo.findFirst({
        where: { campaignId },
        orderBy: { order: 'desc' },
      });

      let currentOrder = lastImgVdo ? lastImgVdo.order + 1 : 0;

      const imgVdoPromises = files.map(file =>
        prisma.imgVdo.create({
          data: {
            filename: file.filename,
            path: `/uploads/${file.filename}`,
            campaignId,
            order: currentOrder++,
          },
        })
      );

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

// DELETE /api/imgsVdos/:id
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

// PUT /api/imgsVdos/:id/order
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
