// Mock data for profile
import type { Profile } from '../types/profile';

const mockProfile: Profile = {
  id: 'user-1',
  email: 'mockuser@example.com',
  firstName: 'Mock',
  lastName: 'User',
  company: 'Mock Company',
};

export async function getProfile(): Promise<Profile> {
  return Promise.resolve(mockProfile);
}

export async function updateProfile(data: Profile): Promise<Profile> {
  return Promise.resolve({ ...mockProfile, ...data });
} 