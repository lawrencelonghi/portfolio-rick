import express from 'express';
import { pool } from '../db/database.js';

const router = express.Router();

// Helper para normalizar URLs
const normalizeUrl = (url: string | null, baseUrl: string, uploadPath: string): string | null => {
  if (!url) return null;
  
  // Se já é URL completa (http/https), retorna como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Se já começa com /, retorna completo
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  
  // Caso contrário, adiciona o prefixo do upload path
  return `${baseUrl}${uploadPath}/${url}`;
};

// GET /api/works - Retorna todas as campanhas com suas imagens
router.get('/', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

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

        // Construir URL completa para o thumb
        const thumbUrl = normalizeUrl(campaign.thumb_url, baseUrl, '/uploads/campaigns');

        return {
          campaign: campaign.title,
          cover: {
            file_url: thumbUrl,
            title: campaign.title
          },
          items: imagesResult.rows.map(img => {
            // Construir URL completa para cada imagem
            const imageUrl = normalizeUrl(img.image_url, baseUrl, '/uploads/gallery');

            return {
              file_url: imageUrl,
              title: `${campaign.title} - ${img.order_index || img.id}`
            };
          })
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