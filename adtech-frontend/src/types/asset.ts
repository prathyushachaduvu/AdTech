export interface Asset {
  id: number;
  name: string;
  type: 'image' | 'video' | 'document' | string;
  size: string;
  date: string;
  status: 'approved' | 'pending' | string;
  tags: string[];
} 