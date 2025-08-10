import type { User } from "@shared/schema";

export interface SubscriptionLimits {
  maxHabits: number;
  hasAdvancedAnalytics: boolean;
  hasAIRecommendations: boolean;
  hasPremiumBiohacks: boolean;
  hasHealthAppIntegration: boolean;
  hasFamilySharing: boolean;
  supportResponseTime: string;
}

export function getSubscriptionLimits(user: User): SubscriptionLimits {
  const isPremium = user.subscriptionTier === 'PREMIUM' && user.subscriptionActive;
  
  if (isPremium) {
    return {
      maxHabits: -1, // Unlimited
      hasAdvancedAnalytics: true,
      hasAIRecommendations: true,
      hasPremiumBiohacks: true,
      hasHealthAppIntegration: true,
      hasFamilySharing: true,
      supportResponseTime: '24 hours'
    };
  }
  
  // Free tier - Enhanced from previous 5 habits to 15
  return {
    maxHabits: 15,
    hasAdvancedAnalytics: false,
    hasAIRecommendations: true, // Basic AI recommendations included
    hasPremiumBiohacks: false,
    hasHealthAppIntegration: false,
    hasFamilySharing: false,
    supportResponseTime: '48 hours'
  };
}

export function canCreateHabit(user: User, currentHabitCount: number): boolean {
  const limits = getSubscriptionLimits(user);
  return limits.maxHabits === -1 || currentHabitCount < limits.maxHabits;
}

export function getHabitLimitMessage(user: User, currentHabitCount: number): string {
  const limits = getSubscriptionLimits(user);
  
  if (limits.maxHabits === -1) {
    return "Unlimited habits available";
  }
  
  const remaining = Math.max(0, limits.maxHabits - currentHabitCount);
  if (remaining === 0) {
    return `Habit limit reached (${limits.maxHabits}). Upgrade to Premium for unlimited habits.`;
  }
  
  return `${remaining} of ${limits.maxHabits} habits remaining. Upgrade for unlimited habits.`;
}