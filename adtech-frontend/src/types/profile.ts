export interface TeamMember {
  name: string;
  role: string;
}

export interface CompanyInfo {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  address?: string;
  logoUrl?: string;
  description?: string;
}

export interface Profile {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  companyName: string;
  website: string;
  industry: string;
  companyLogo: string | null;
  profilePicture: string | null;
  notificationPreferences: string[];
  dashboardLayout: 'compact' | 'detailed' | 'creative';
  teamMembers: TeamMember[];
  plan: string;
  campaigns: number;
  impressions: string;
  uploads: number;
  companyInfo: CompanyInfo;
} 