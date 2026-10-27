// Campaign status types
export type CampaignStatus = 'active' | 'paused' | 'completed';

// Campaign objectives
export type CampaignObjective = 'brand awareness' | 'conversions' | 'traffic' | 'lead generation';

// Key campaign metrics
export interface CampaignMetrics {
  ctr: number; // Click-through rate (%)
  impressions: number;
  conversions: number;
  cpa: number; // Cost per acquisition
  lastModified: string; // ISO date string
}

// Main Campaign interface
export interface Campaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budget: number;
  spend: number;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  metrics: CampaignMetrics;
  aiOptimizationTip?: string;
  hasAiSuggestion?: boolean;
  createdAt: string; // ISO date string
} 