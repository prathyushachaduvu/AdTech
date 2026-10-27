// Creative Studio Types

// Creative Goal types
export type CreativeGoal = 'awareness' | 'conversions' | 'retargeting';

// Style types
export type CreativeStyle = 'modern' | 'classic' | 'bold' | 'minimal' | 'playful';

// Format types
export type CreativeFormat = 'display-ad' | 'instagram-post' | 'story' | 'banner';

// Brand voice types
export type BrandVoice = 'professional' | 'casual' | 'friendly' | 'luxury' | 'playful';

// Tone types
export type Tone = 'formal' | 'informal' | 'enthusiastic' | 'calm' | 'urgent';

// Asset types
export type AssetType = 'logo' | 'product-image' | 'brand-guideline' | 'color-palette' | 'font';

// Generation status
export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';

// Creative interface
export interface Creative {
  id: string;
  imageUrl: string;
  style: CreativeStyle;
  format: CreativeFormat;
  campaignName: string;
  goal: CreativeGoal;
  createdAt: string;
  isSelected: boolean;
  generationProgress?: number;
}

// Generation settings interface
export interface GenerationSettings {
  campaignName: string;
  goal: CreativeGoal;
  styles: CreativeStyle[];
  formats: CreativeFormat[];
  variationQuantity: number;
  brandVoice: BrandVoice;
  tone: Tone;
  optionalPrompt?: string;
  selectedAssets: Asset[];
}

// Asset interface
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  thumbnailUrl?: string;
  fileType: string;
  size?: number;
  uploadedAt: string;
  isSelected: boolean;
}

// Generation progress interface
export interface GenerationProgress {
  totalCreatives: number;
  currentCreative: number;
  status: GenerationStatus;
  progress: number;
  message: string;
} 