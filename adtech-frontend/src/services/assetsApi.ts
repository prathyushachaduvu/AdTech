// Mock data for assets
import type { Asset } from '../types/asset';

const mockAssets: Asset[] = [
  { id: 'a1', name: 'Mock Asset 1', type: 'image', url: '/mock1.jpg', campaignId: '1' },
  { id: 'a2', name: 'Mock Asset 2', type: 'video', url: '/mock2.mp4', campaignId: '2' },
];

export async function getAssets(campaignId: string): Promise<Asset[]> {
  return Promise.resolve(mockAssets.filter(a => a.campaignId === campaignId));
}

export async function createAsset(campaignId: string, asset: Partial<Asset>): Promise<Asset> {
  const newAsset = { ...asset, id: String(Date.now()), campaignId } as Asset;
  return Promise.resolve(newAsset);
}

export async function updateAsset(assetId: string, asset: Partial<Asset>): Promise<Asset> {
  return Promise.resolve({ ...asset, id: assetId } as Asset);
}

export async function deleteAsset(assetId: string): Promise<void> {
  return Promise.resolve();
} 