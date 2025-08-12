import type { User } from "@shared/schema";

// Mock user for beta testing - removes authentication requirements
const mockBetaUser: User = {
  id: "beta-tester",
  email: "beta@evolv-app.com",
  firstName: "Beta",
  lastName: "Tester",
  profileImageUrl: null,
  subscriptionTier: "FREE",
  subscriptionId: null,
  subscriptionActive: false,
  trialEndDate: null,
  country: null,
  region: null,
  city: null,
  timezone: null,
  currency: null,
  countryCode: null,
  locationUpdatedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useAuth() {
  // For beta testing: return mock user immediately, no API calls needed
  return {
    user: mockBetaUser,
    isLoading: false,
    isAuthenticated: true,
  };
}
