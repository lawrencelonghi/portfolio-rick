import type {Request, Response} from 'express';
import { Router } from 'express'
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs'
import path from 'path';

const router = Router()
const prisma = new PrismaClient()

//POST /api/campaigns/:campagingId/imgsVdos upload imgVdo
router.post('/campaign/:campaignId', authMiddleware, upload.array('imgVdos', 10), async (req: Request, res: Response) => {
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

    const lastImgVdo = await prisma.imgVdo.findFirst({
      where: { campaignId },
      orderBy: { order: 'desc' }
    })

    let currentOrder = lastImgVdo ? lastImgVdo.order + 1 : 0

    //create database records for each imgVdo
    const imgVdoPromises = files.map(async (file) => {
      const imgVdo = await prisma.imgVdo.create({
        data: {
          filename: file.filename,
          path: `/uploads/${file.filename}`,
          campaignId,
          order: currentOrder++
        }
      })
      return imgVdo
    })

    const imgsVdos = await Promise.all(imgVdoPromises);

    
    return res.status(201).json({
      message: `${imgsVdos.length} imgVdom(ns) enviada(s) com sucesso`,
      imgsVdos   
    })

    
  } catch (error) {
    console.error('Error when uploading imgsVdos:', error);
    return res.status(500).json({ error: 'Error when uploading imgsVdos' });
  }
})

//DELETE /api/imgsVdos/:id delete imgsVdos
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    
    const id = req.params.id

    if(!id) {
      return res.status(400).json({ error: 'imgVdo ID is required' });
    }

    const imgVdo = await prisma.imgVdo.findUnique({
      where: { id },
      include: {campaign: true}
    })

    if(!imgVdo) {
      return res.status(404).json({ error: 'imgVdo not found' });
    }

    //if imgVdo is thumb remove reference
    if (imgVdo.campaign.thumbnailId === id) {
      await prisma.campaign.update({
        where: { id: imgVdo.campaignId },
        data: { thumbnailId: null }
      });
    }

    //delete imgVdo from disk
    const filePath = path.join(process.cwd(),'uploads', imgVdo.filename)
    if(fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    //delete imgVdo from database
    await prisma.imgVdo.delete({
      where: { id }
    })

    return res.json({message: 'imgVdo deleted successfully'})
  } catch (error) {
    console.error('Error when deleting imgVdo:', error);
    return res.status(500).json({ error: 'Error when deleting imgVdo' });
  }
})
    //PUT /api/imgsVdos/:id update imgsVdos order
    router.put('/:id/order', authMiddleware, async (req: Request, res: Response) => {
      
      try {
        const id = req.params.id
        const { order } = req.body

        if(!id) {
          return res.status(400).json({ error: 'imgVdo ID is required' });
        }

        if(order === undefined) {
          return res.status(400).json({ error: 'order is required' });
        }

        const imgVdo = await prisma.imgVdo.update({
          where: { id },
          data: { order }
        })

        return res.json(imgVdo);

      } catch (error) {
        console.error('error when updating imgVdo');
        return res.status(500).json({ error: 'error when updating imgVdo' });
        
      }
    })

export default router


