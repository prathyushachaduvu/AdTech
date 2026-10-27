// Mock data for brand guidelines
export interface BrandColor {
  id: string;
  name: string;
  hexCode: string;
  description?: string;
  category: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic';
}

export interface BrandFont {
  id: string;
  name: string;
  family: string;
  weights: string[];
  usage: string;
}

export interface BrandGuidelines {
  id: string;
  companyId: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  usageGuidelines: string;
  attachments: string[];
  lastUpdated: string;
  version: string;
}

const mockBrandGuidelines: BrandGuidelines = {
  id: 'bg-1',
  companyId: 'company-1',
  colors: [
    { id: 'c1', name: 'Primary Blue', hexCode: '#007bff', category: 'primary' },
    { id: 'c2', name: 'Accent Red', hexCode: '#ff0000', category: 'accent' },
  ],
  fonts: [
    { id: 'f1', name: 'Roboto', family: 'Roboto, sans-serif', weights: ['400', '700'], usage: 'Headings' },
  ],
  usageGuidelines: 'Use brand colors and fonts as specified.',
  attachments: [],
  lastUpdated: '2025-07-23',
  version: '1.0',
};

export async function getBrandGuidelines(companyId: string): Promise<BrandGuidelines> {
  return Promise.resolve(mockBrandGuidelines);
}

export async function updateBrandGuidelines(companyId: string, updated: Partial<BrandGuidelines>): Promise<BrandGuidelines> {
  return Promise.resolve({ ...mockBrandGuidelines, ...updated });
}

export async function saveBrandGuidelines(companyId: string, data: BrandGuidelines): Promise<BrandGuidelines> {
  return Promise.resolve(data);
} 