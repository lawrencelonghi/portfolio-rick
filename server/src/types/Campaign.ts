export interface Campaign {
  id: number;
  title: string;
  thumb_url?: string;
  order_index?: number;
}

export interface CampaignImage {
  id: number;
  campaign_id: number;
  image_url: string;
  order_index?: number;
}

// Tipo para a resposta da API com imagens incluídas
export interface CampaignWithImages extends Campaign {
  images: CampaignImage[];
}