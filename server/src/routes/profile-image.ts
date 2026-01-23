import type {Request, Response} from 'express';
import { Router } from 'express'
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs'
import path from 'path';

const router = Router()
const prisma = new PrismaClient()

// GET /api/profile-image - buscar a imagem (público)
router.get('/', async (req: Request, res: Response) => {
  try {
    const image = await prisma.profileImage.findFirst();
    return res.json(image);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    return res.status(500).json({ error: 'Error fetching profile image' });
  }
});


//PUT /api/profileImage upload image
router.put('/', authMiddleware, upload.single('profileImage'), async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File

    if(!file) {
      return res.status(400).json({ error: 'No file was uploaded' });
    }

    const currentProfileImage = await prisma.profileImage.findFirst();

    if (currentProfileImage) {
      const oldPath = path.join(process.cwd(), 'uploads', currentProfileImage.filename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

    const updateProfileImage = await prisma.profileImage.update({
        where: { id: currentProfileImage.id },
        data: {
          filename: file.filename,
          path: `/uploads/${file.filename}`
        }
    })

    return res.status(201).json({
      message: `Image uploaded successfully`,
      updateProfileImage
    })
  }

  const newProfileImage = await prisma.profileImage.create({
    data: {
      filename: file.filename,
      path: `/uploads/${file.filename}`
    }
  })

  return res.status(201).json({
    message: `Image uploaded successfully`,
    newProfileImage
  })

  } catch (error) {
      console.error('Error when uploading profile image:', error);
      return res.status(500).json({ error: 'Error when uploading profile image' });
  }
  
})

export default router