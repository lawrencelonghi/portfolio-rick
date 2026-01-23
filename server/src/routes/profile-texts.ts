import type { Request, Response } from "express"; 
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from '../middleware/auth.js';

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req: Request, res: Response) => {
  try {
    const profileText = await prisma.profileText.findFirst()

    if(!profileText) {
      return res.json({ textPt: '', textEn: '' })
    }

    return res.json(profileText);

  } catch (error) {
    console.error('Error fetching profile text:', error);
    return res.status(500).json({ error: 'Error fetching profile text' });
  }
})

router.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { textPt, textEn } = req.body

    if(textPt === undefined && textEn === undefined) {
      return res.status(400).json({ error: 'At least one text is required' });
    } 

    const currentText = await prisma.profileText.findFirst()

    let profileText

    if(currentText) {
      profileText = await prisma.profileText.update({
        where: { id: currentText.id },
        data: {
          ...(textPt !== undefined && { textPt }),
          ...(textEn !== undefined && { textEn })
        }
      })
    } else {
        profileText = await prisma.profileText.create({
          data: {
            textPt: textPt || '',
            textEn: textEn || ''
          }
        });
    }

    return res.json(profileText);

  } catch (error) {
    console.error('Error updating profile text:', error);
    return res.status(500).json({ error: 'Error updating profile text' });
  }
})

export default router