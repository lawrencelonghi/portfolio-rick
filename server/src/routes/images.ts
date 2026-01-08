import type {Request, Response} from 'express';
import { Router } from 'express'
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs'
import path from 'path';

const router = Router()
const prisma = new PrismaClient()

//POST /api/campaigns/:campagingId/images upload image
router.post('/:campaignId/images', authMiddleware, upload.array('images', 10), async (req: Request, res: Response) => {
  try {

    const campaignId = req.params.campaignId
    const files = req.files as Express.Multer.File[]

    if(!campaignId) {
      return res.status(400).json({ error: 'Campaign id is required' });
    }

    if(!files || files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }
    
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if(!campaign) {
      //delete files if it doesent exist
      files.forEach(files => fs.unlinkSync(files.path))
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const lastImage = await prisma.image.findFirst({
      where: { campaignId },
      orderBy: { order: 'desc' }
    })

    let currentOrder = lastImage ? lastImage.order + 1 : 0

    //create database records for each image
    const imagePromises = files.map(async (file) => {
      const image = await prisma.image.create({
        data: {
          filename: file.filename,
          path: `/uploads/${file.filename}`,
          campaignId,
          order: currentOrder++
        }
      })
      return image
    })

    const images = await Promise.all(imagePromises);

    
    return res.status(201).json({
      message: `${images.length} imagem(ns) enviada(s) com sucesso`,
      images   
    })

    
  } catch (error) {
    console.error('Error when uploading images:', error);
    return res.status(500).json({ error: 'Error when uploading images' });
  }
})

//DELETE /api/images/:id delete images
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    
    const id = req.params.id

    if(!id) {
      return res.status(400).json({ error: 'image ID is required' });
    }

    const image = await prisma.image.findUnique({
      where: { id },
      include: {campaign: true}
    })

    if(!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    //if image is thumb remove reference
    if (image.campaign.thumbnailId === id) {
      await prisma.campaign.update({
        where: { id: image.campaignId },
        data: { thumbnailId: null }
      });
    }

    //delete image from disk
    const filePath = path.join(process.cwd(),'uploads', image.filename)
    if(fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    //delete image from database
    await prisma.image.delete({
      where: { id }
    })

    return res.json({message: 'Image deleted successfully'})
  } catch (error) {
    console.error('Error when deleting image:', error);
    return res.status(500).json({ error: 'Error when deleting image' });
  }
})
    //PUT /api/images/:id update images order
    router.put('/:id/order', authMiddleware, async (req: Request, res: Response) => {
      
      try {
        const id = req.params.id
        const { order } = req.body

        if(!id) {
          return res.status(400).json({ error: 'image ID is required' });
        }

        if(order === undefined) {
          return res.status(400).json({ error: 'order is required' });
        }

        const image = await prisma.image.update({
          where: { id },
          data: { order }
        })

        return res.json(image);

      } catch (error) {
        console.error('error when updating image');
        return res.status(500).json({ error: 'error when updating image' });
        
      }
    })

export default router


