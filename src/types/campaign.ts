export interface CampaignBackground {
  id: string;
  title: string;
  content: string;
  source_type: "text" | "image_ocr";
  embedding: number[] | null;
  created_at: string;
}
