// Mock data for campaigns
import type { Campaign } from '../types/campaign';

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Mock Campaign 1', status: 'active', startDate: '2025-01-01', endDate: '2025-12-31', budget: 1000 },
  { id: '2', name: 'Mock Campaign 2', status: 'paused', startDate: '2025-02-01', endDate: '2025-11-30', budget: 500 },
];

export async function getCampaigns(): Promise<Campaign[]> {
  return Promise.resolve(mockCampaigns);
}

export async function updateCampaign(updated: Campaign): Promise<Campaign> {
  return Promise.resolve(updated);
}

export async function deleteCampaign(id: string): Promise<void> {
  return Promise.resolve();
} 