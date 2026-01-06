import express from 'express';
import { pool } from '../db/database.js';

const router = express.Router();

// GET /api/works - Retorna todas as campanhas com suas imagens
router.get('/', async (req, res) => {
  try {
    // Buscar todas as campanhas ordenadas
    const campaignsResult = await pool.query(
      'SELECT * FROM campaigns ORDER BY order_index ASC, id ASC'
    );

    // Para cada campanha, buscar suas imagens
    const campaignsWithImages = await Promise.all(
      campaignsResult.rows.map(async (campaign) => {
        const imagesResult = await pool.query(
          'SELECT * FROM campaign_images WHERE campaign_id = $1 ORDER BY order_index ASC, id ASC',
          [campaign.id]
        );

        return {
          campaign: campaign.title,
          cover: {
            file_url: campaign.thumb_url,
            title: campaign.title
          },
          items: imagesResult.rows.map(img => ({
            file_url: img.image_url,
            title: `${campaign.title} - ${img.order_index || img.id}`
          }))
        };
      })
    );

    res.json(campaignsWithImages);
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error);
    res.status(500).json({ error: 'Erro ao buscar campanhas' });
  }
});

export default router;