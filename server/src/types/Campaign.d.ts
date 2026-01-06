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
export interface CampaignWithImages extends Campaign {
    images: CampaignImage[];
}
//# sourceMappingURL=Campaign.d.ts.map