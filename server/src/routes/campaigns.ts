import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/campaigns
router.get('/', async (_req: Request, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { order: 'asc' },
      include: {
        thumbnail: true,
        imgVdos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return res.json(campaigns);
  } catch (error) {
    console.error('error when listing all campaigns:', error);
    return res.status(500).json({ error: 'error when listing all campaigns' });
  }
});

// GET /api/campaigns/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        thumbnail: true,
        imgVdos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    return res.json(campaign);
  } catch (error) {
    console.error('error when searching for campaign:', error);
    return res.status(500).json({ error: 'error when searching for campaign' });
  }
});

// POST /api/campaigns
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Invalid description' });
    }

    const lastCampaign = await prisma.campaign.findFirst({
      orderBy: { order: 'desc' },
    });

    const newOrder = lastCampaign ? lastCampaign.order + 1 : 0;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description: description ?? null,
        order: newOrder,
      },
    });

    return res.status(201).json(campaign);
  } catch (error) {
    console.error('Error when creating campaign:', error);
    return res.status(500).json({ error: 'Error when creating campaign' });
  }
});

// PUT /api/campaigns/:id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid id' });
    }

    if (title !== undefined && typeof title !== 'string') {
      return res.status(400).json({ error: 'Invalid title' });
    }

    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Invalid description' });
    }

    if (order !== undefined && typeof order !== 'number') {
      return res.status(400).json({ error: 'Invalid order' });
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
      },
    });

    return res.json(campaign);
  } catch (error) {
    console.error('Error when updating campaign:', error);
    return res.status(500).json({ error: 'Error when updating campaign' });
  }
});

// DELETE /api/campaigns/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid id' });
    }

    await prisma.campaign.delete({
      where: { id },
    });

    return res.json({ message: 'Campaign deleted' });
  } catch (error) {
    console.error('Error when deleting campaign:', error);
    return res.status(500).json({ error: 'Error when deleting campaign' });
  }
});

// PUT /api/campaigns/:id/thumbnail
router.put('/:id/thumbnail', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { imgVdoId } = req.body;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid campaign id' });
    }

    if (typeof imgVdoId !== 'string') {
      return res.status(400).json({ error: 'Invalid ImgVdo id' });
    }

    const imgVdo = await prisma.imgVdo.findUnique({
      where: { id: imgVdoId },
    });

    if (!imgVdo || imgVdo.campaignId !== id) {
      return res.status(404).json({ error: 'ImgVdo not found' });
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        thumbnailId: imgVdoId,
      },
    });

    return res.json(campaign);
  } catch (error) {
    console.error('Error when defining thumbnail:', error);
    return res.status(500).json({ error: 'Error when defining thumbnail' });
  }
});

export default router;
