import {
  users,
  habits,
  habitCompletions,
  dailyMetrics,
  biohacks,
  userBiohackBookmarks,
  aiRecommendations,
  betaFeedback,
  betaSignups,
  type User,
  type UpsertUser,
  type InsertHabit,
  type Habit,
  type InsertHabitCompletion,
  type HabitCompletion,
  type InsertDailyMetrics,
  type DailyMetrics,
  type InsertBiohack,
  type Biohack,
  type UserBiohackBookmark,
  type AIRecommendation,
  type InsertAIRecommendation,
  type BetaFeedback,
  type InsertBetaFeedback,
  type BetaSignup,
  type InsertBetaSignup,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfileImage(id: string, imageUrl: string): Promise<void>;
  updateUserProfile(id: string, data: Partial<{ firstName: string; lastName: string }>): Promise<void>;
  upgradeUserSubscription(id: string, planType: 'monthly' | 'yearly'): Promise<void>;
  updateUserSubscription(id: string, data: Partial<{ subscriptionTier: string; subscriptionActive: boolean; subscriptionId: string | null }>): Promise<void>;
  updateUserLocation(userId: string, locationData: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
    currency?: string;
    countryCode?: string;
    locationUpdatedAt?: Date;
  }): Promise<void>;
  
  // Habit operations
  getUserHabits(userId: string): Promise<Habit[]>;
  createHabit(userId: string, habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, userId: string, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  deleteHabit(id: number, userId: string): Promise<boolean>;
  getHabit(id: number, userId: string): Promise<Habit | undefined>;
  
  // Habit completion operations
  createHabitCompletion(userId: string, completion: InsertHabitCompletion): Promise<HabitCompletion>;
  getHabitCompletions(userId: string, habitId?: number, date?: string): Promise<HabitCompletion[]>;
  deleteHabitCompletion(habitId: number, userId: string, date: string): Promise<boolean>;
  getHabitStreak(habitId: number, userId: string): Promise<number>;
  
  // Daily metrics operations
  upsertDailyMetrics(userId: string, metrics: InsertDailyMetrics): Promise<DailyMetrics>;
  getDailyMetrics(userId: string, date?: string): Promise<DailyMetrics | undefined>;
  getRecentMetrics(userId: string, days?: number): Promise<DailyMetrics[]>;
  
  // Biohack operations
  getAllBiohacks(): Promise<Biohack[]>;
  getBiohacksByCategory(category: string): Promise<Biohack[]>;
  getUserBookmarkedBiohacks(userId: string): Promise<(Biohack & { isBookmarked: boolean })[]>;
  toggleBiohackBookmark(userId: string, biohackId: number): Promise<boolean>;
  initializeBiohacks(): Promise<void>;
  
  // Beta Feedback operations
  createBetaFeedback(feedback: InsertBetaFeedback): Promise<BetaFeedback>;
  getBetaFeedbackByUser(userId: string): Promise<BetaFeedback[]>;
  getAllBetaFeedback(): Promise<BetaFeedback[]>;
  updateBetaFeedbackStatus(id: number, status: string): Promise<void>;

  // Analytics operations
  getDashboardStats(userId: string): Promise<{
    currentStreak: number;
    habitsCompletedToday: number;
    totalHabitsToday: number;
    wellnessScore: number;
    weeklyProgress: number;
  }>;

  // AI Recommendations operations
  getAIRecommendations(userId: string): Promise<AIRecommendation[]>;
  createAIRecommendation(userId: string, recommendation: Omit<InsertAIRecommendation, 'userId'>): Promise<AIRecommendation>;
  clearAIRecommendations(userId: string): Promise<void>;
  markRecommendationAsRead(recommendationId: number, userId: string): Promise<void>;
  toggleRecommendationBookmark(recommendationId: number, userId: string): Promise<boolean>;

  // Beta Feedback operations
  createBetaFeedback(feedback: InsertBetaFeedback): Promise<BetaFeedback>;
  getBetaFeedbackByUser(userId: string): Promise<BetaFeedback[]>;
  getAllBetaFeedback(): Promise<BetaFeedback[]>;
  updateBetaFeedbackStatus(id: number, status: string): Promise<void>;

  // Beta Signup operations
  createBetaSignup(signup: InsertBetaSignup): Promise<BetaSignup>;
  getAllBetaSignups(): Promise<BetaSignup[]>;
  updateBetaSignupStatus(id: number, status: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfileImage(id: string, imageUrl: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        profileImageUrl: imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updateUserProfile(id: string, data: Partial<{ firstName: string; lastName: string }>): Promise<void> {
    await db
      .update(users)
      .set({ 
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async upgradeUserSubscription(id: string, planType: 'monthly' | 'yearly'): Promise<void> {
    const subscriptionId = `sub_${Date.now()}_${planType}`;
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial
    
    await db
      .update(users)
      .set({
        subscriptionTier: 'PREMIUM',
        subscriptionId,
        subscriptionActive: true,
        trialEndDate,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updateUserSubscription(id: string, data: Partial<{ subscriptionTier: string; subscriptionActive: boolean; subscriptionId: string | null }>): Promise<void> {
    await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updateUserLocation(userId: string, locationData: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
    currency?: string;
    countryCode?: string;
    locationUpdatedAt?: Date;
  }): Promise<void> {
    await db
      .update(users)
      .set({
        ...locationData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Habit operations
  async getUserHabits(userId: string): Promise<Habit[]> {
    return await db
      .select()
      .from(habits)
      .where(and(eq(habits.userId, userId), eq(habits.isActive, true)))
      .orderBy(desc(habits.createdAt));
  }

  async createHabit(userId: string, habit: InsertHabit): Promise<Habit> {
    const [newHabit] = await db
      .insert(habits)
      .values({ ...habit, userId })
      .returning();
    return newHabit;
  }

  async updateHabit(id: number, userId: string, habit: Partial<InsertHabit>): Promise<Habit | undefined> {
    const [updatedHabit] = await db
      .update(habits)
      .set({ ...habit, updatedAt: new Date() })
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();
    return updatedHabit;
  }

  async deleteHabit(id: number, userId: string): Promise<boolean> {
    const [deletedHabit] = await db
      .update(habits)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();
    return !!deletedHabit;
  }

  async getHabit(id: number, userId: string): Promise<Habit | undefined> {
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)));
    return habit;
  }

  // Habit completion operations
  async createHabitCompletion(userId: string, completion: InsertHabitCompletion): Promise<HabitCompletion> {
    const [newCompletion] = await db
      .insert(habitCompletions)
      .values({ ...completion, userId })
      .returning();
    return newCompletion;
  }

  async getHabitCompletions(userId: string, habitId?: number, date?: string): Promise<HabitCompletion[]> {
    const conditions = [eq(habitCompletions.userId, userId)];

    if (habitId) {
      conditions.push(eq(habitCompletions.habitId, habitId));
    }

    if (date) {
      conditions.push(sql`DATE(${habitCompletions.completedAt}) = ${date}`);
    }

    return await db
      .select()
      .from(habitCompletions)
      .where(and(...conditions))
      .orderBy(desc(habitCompletions.completedAt));
  }

  async deleteHabitCompletion(habitId: number, userId: string, date: string): Promise<boolean> {
    const result = await db
      .delete(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.userId, userId),
          sql`DATE(${habitCompletions.completedAt}) = ${date}`
        )
      );
    return (result.rowCount || 0) > 0;
  }

  async getHabitStreak(habitId: number, userId: string): Promise<number> {
    const completions = await db
      .select({ completedAt: habitCompletions.completedAt })
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.userId, userId)
        )
      )
      .orderBy(desc(habitCompletions.completedAt));

    if (completions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const completion of completions) {
      const completionDate = new Date(completion.completedAt);
      completionDate.setHours(0, 0, 0, 0);
      
      const diffTime = currentDate.getTime() - completionDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays === streak + 1 && streak === 0) {
        // Today's completion
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // Daily metrics operations
  async upsertDailyMetrics(userId: string, metrics: InsertDailyMetrics): Promise<DailyMetrics> {
    const [metric] = await db
      .insert(dailyMetrics)
      .values({ ...metrics, userId })
      .onConflictDoUpdate({
        target: [dailyMetrics.userId, dailyMetrics.date],
        set: {
          ...metrics,
          updatedAt: new Date(),
        },
      })
      .returning();
    return metric;
  }

  async getDailyMetrics(userId: string, date?: string): Promise<DailyMetrics | undefined> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const [metric] = await db
      .select()
      .from(dailyMetrics)
      .where(
        and(
          eq(dailyMetrics.userId, userId),
          eq(dailyMetrics.date, targetDate)
        )
      );
    return metric;
  }

  async getRecentMetrics(userId: string, days: number = 30): Promise<DailyMetrics[]> {
    return await db
      .select()
      .from(dailyMetrics)
      .where(eq(dailyMetrics.userId, userId))
      .orderBy(desc(dailyMetrics.date))
      .limit(days);
  }

  // Biohack operations
  async getAllBiohacks(): Promise<Biohack[]> {
    return await db.select().from(biohacks).orderBy(biohacks.name);
  }

  async getBiohacksByCategory(category: string): Promise<Biohack[]> {
    return await db
      .select()
      .from(biohacks)
      .where(eq(biohacks.category, category))
      .orderBy(biohacks.name);
  }

  async getUserBookmarkedBiohacks(userId: string): Promise<(Biohack & { isBookmarked: boolean })[]> {
    const result = await db
      .select({
        id: biohacks.id,
        name: biohacks.name,
        category: biohacks.category,
        description: biohacks.description,
        instructions: biohacks.instructions,
        timeRequired: biohacks.timeRequired,
        difficulty: biohacks.difficulty,
        benefits: biohacks.benefits,
        equipmentNeeded: biohacks.equipmentNeeded,
        scientificBacking: biohacks.scientificBacking,
        imageUrl: biohacks.imageUrl,
        createdAt: biohacks.createdAt,
        isBookmarked: sql<boolean>`CASE WHEN ${userBiohackBookmarks.id} IS NOT NULL THEN true ELSE false END`
      })
      .from(biohacks)
      .leftJoin(
        userBiohackBookmarks,
        and(
          eq(userBiohackBookmarks.biohackId, biohacks.id),
          eq(userBiohackBookmarks.userId, userId)
        )
      )
      .orderBy(biohacks.name);

    return result;
  }

  async toggleBiohackBookmark(userId: string, biohackId: number): Promise<boolean> {
    const existing = await db
      .select()
      .from(userBiohackBookmarks)
      .where(
        and(
          eq(userBiohackBookmarks.userId, userId),
          eq(userBiohackBookmarks.biohackId, biohackId)
        )
      );

    if (existing.length > 0) {
      await db
        .delete(userBiohackBookmarks)
        .where(
          and(
            eq(userBiohackBookmarks.userId, userId),
            eq(userBiohackBookmarks.biohackId, biohackId)
          )
        );
      return false;
    } else {
      await db
        .insert(userBiohackBookmarks)
        .values({ userId, biohackId });
      return true;
    }
  }

  async initializeBiohacks(): Promise<void> {
    const existing = await db.select({ count: count() }).from(biohacks);
    if (existing[0].count > 0) return;

    const initialBiohacks: InsertBiohack[] = [
      {
        name: "Wim Hof Breathing",
        category: "Breathwork",
        description: "Powerful breathing technique for stress reduction and energy boost",
        instructions: "1. Take 30 deep breaths. 2. Hold breath after exhale for as long as comfortable. 3. Take a deep breath and hold for 15 seconds. 4. Repeat 3-4 rounds.",
        timeRequired: "10 minutes",
        difficulty: "Beginner",
        benefits: "Reduces stress, increases energy, improves immune function, enhances focus",
        equipmentNeeded: "None",
        scientificBacking: "Studies show improved immune response and stress resilience",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Cold Exposure Therapy",
        category: "Recovery",
        description: "Boost metabolism and mental resilience through controlled cold exposure",
        instructions: "Start with 30-second cold showers, gradually increase duration. Focus on controlled breathing throughout.",
        timeRequired: "5 minutes",
        difficulty: "Intermediate",
        benefits: "Improved circulation, enhanced mood, increased metabolism, stress resilience",
        equipmentNeeded: "Cold shower or ice bath",
        scientificBacking: "Research shows activation of brown fat and norepinephrine release",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Red Light Therapy",
        category: "Recovery",
        description: "Enhance cellular energy and accelerate recovery with targeted light therapy",
        instructions: "Position red light device 6-12 inches from skin. Expose treatment area for 10-20 minutes.",
        timeRequired: "15 minutes",
        difficulty: "Beginner",
        benefits: "Improved cellular function, faster recovery, enhanced skin health, reduced inflammation",
        equipmentNeeded: "Red light therapy device",
        scientificBacking: "Proven to stimulate mitochondrial function and ATP production",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Intermittent Fasting",
        category: "Nutrition",
        description: "Strategic eating windows to optimize metabolism and cellular regeneration",
        instructions: "Start with 16:8 method - eat within 8 hours, fast for 16. Begin with 12:12 and gradually extend fasting window.",
        timeRequired: "All day",
        difficulty: "Intermediate",
        benefits: "Weight management, improved insulin sensitivity, cellular autophagy, mental clarity",
        equipmentNeeded: "None",
        scientificBacking: "Extensive research on metabolic benefits and longevity",
        imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Grounding (Earthing)",
        category: "Recovery",
        description: "Direct skin contact with earth to reduce inflammation and improve sleep",
        instructions: "Walk barefoot on grass, sand, or dirt for 15-30 minutes. Focus on connecting feet directly to natural surfaces.",
        timeRequired: "20 minutes",
        difficulty: "Beginner",
        benefits: "Reduced inflammation, better sleep, stress reduction, improved circulation",
        equipmentNeeded: "Natural outdoor surface",
        scientificBacking: "Studies show reduced cortisol and improved heart rate variability",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Box Breathing",
        category: "Breathwork",
        description: "4-4-4-4 breathing pattern for instant stress relief and focus",
        instructions: "Inhale for 4 counts, hold for 4, exhale for 4, hold empty for 4. Repeat for 5-10 cycles.",
        timeRequired: "5 minutes",
        difficulty: "Beginner",
        benefits: "Reduced anxiety, improved focus, better emotional regulation, lowered blood pressure",
        equipmentNeeded: "None",
        scientificBacking: "Navy SEAL technique proven to activate parasympathetic nervous system",
        imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Sauna Therapy",
        category: "Recovery",
        description: "Heat exposure for cardiovascular health and longevity",
        instructions: "15-20 minutes at 160-180°F, followed by cool shower. Start with shorter sessions and build tolerance.",
        timeRequired: "25 minutes",
        difficulty: "Intermediate",
        benefits: "Improved cardiovascular health, better sleep, increased growth hormone, stress resilience",
        equipmentNeeded: "Sauna access",
        scientificBacking: "Finnish studies show 20% reduction in cardiovascular mortality",
        imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Blue Light Blocking",
        category: "Sleep",
        description: "Filter harmful blue light to optimize circadian rhythm and sleep quality",
        instructions: "Wear blue light blocking glasses 2-3 hours before bed. Use amber or red filters on devices after sunset.",
        timeRequired: "Evening routine",
        difficulty: "Beginner",
        benefits: "Better sleep quality, improved melatonin production, reduced eye strain",
        equipmentNeeded: "Blue light blocking glasses",
        scientificBacking: "Research shows 23% improvement in sleep quality",
        imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Morning Sunlight Exposure",
        category: "Sleep",
        description: "Natural light exposure to regulate circadian rhythm and boost mood",
        instructions: "Get 10-15 minutes of direct sunlight within first hour of waking. Face east if possible, no sunglasses.",
        timeRequired: "15 minutes",
        difficulty: "Beginner",
        benefits: "Better sleep cycle, increased vitamin D, improved mood, enhanced alertness",
        equipmentNeeded: "Access to sunlight",
        scientificBacking: "Proven to regulate circadian clock and improve sleep onset",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Contrast Showers",
        category: "Recovery",
        description: "Alternating hot and cold water for improved circulation and resilience",
        instructions: "2 minutes hot water, 30 seconds cold water. Repeat 3-5 cycles, always end with cold.",
        timeRequired: "8 minutes",
        difficulty: "Intermediate",
        benefits: "Enhanced circulation, improved immune function, increased mental toughness",
        equipmentNeeded: "Shower with temperature control",
        scientificBacking: "Hydrotherapy research shows improved circulation and recovery",
        imageUrl: "https://images.unsplash.com/photo-1620916297067-e4e5e3c95e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Meditation",
        category: "Mindfulness",
        description: "Mindfulness practice for stress reduction and cognitive enhancement",
        instructions: "Sit comfortably, focus on breath. When mind wanders, gently return attention to breathing. Start with 5-10 minutes.",
        timeRequired: "10 minutes",
        difficulty: "Beginner",
        benefits: "Reduced stress, improved focus, better emotional regulation, increased self-awareness",
        equipmentNeeded: "Quiet space",
        scientificBacking: "8-week programs show measurable brain changes in stress-related areas",
        imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "High-Intensity Interval Training",
        category: "Exercise",
        description: "Short bursts of intense exercise for maximum metabolic benefit",
        instructions: "20 seconds all-out effort, 40 seconds rest. Repeat 8 rounds. Use bodyweight exercises like burpees or mountain climbers.",
        timeRequired: "8 minutes",
        difficulty: "Advanced",
        benefits: "Improved cardiovascular health, increased metabolism, time-efficient fat burning",
        equipmentNeeded: "None",
        scientificBacking: "Studies show HIIT produces similar benefits to longer cardio sessions",
        imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Gratitude Journaling",
        category: "Mindfulness",
        description: "Daily practice of acknowledging positive aspects of life",
        instructions: "Write down 3 things you're grateful for each day. Be specific and focus on experiences, people, or personal growth.",
        timeRequired: "5 minutes",
        difficulty: "Beginner",
        benefits: "Improved mood, better relationships, increased life satisfaction, better sleep",
        equipmentNeeded: "Journal and pen",
        scientificBacking: "Positive psychology research shows 25% increase in happiness",
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Forest Bathing",
        category: "Recovery",
        description: "Immersive nature experience for stress reduction and immune system boost",
        instructions: "Spend 2+ hours in forest environment. Walk slowly, breathe deeply, engage all senses. No devices or goals.",
        timeRequired: "2 hours",
        difficulty: "Beginner",
        benefits: "Reduced stress hormones, boosted immune function, improved mood, better sleep",
        equipmentNeeded: "Access to forest or wooded area",
        scientificBacking: "Japanese shinrin-yoku research shows increased NK cell activity",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Dry Brushing",
        category: "Recovery",
        description: "Lymphatic drainage technique for detoxification and skin health",
        instructions: "Use dry brush on skin before shower. Brush toward heart in long strokes. Start at feet, work upward.",
        timeRequired: "5 minutes",
        difficulty: "Beginner",
        benefits: "Improved lymphatic drainage, better skin texture, increased circulation",
        equipmentNeeded: "Natural bristle body brush",
        scientificBacking: "Supports lymphatic system function and circulation",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        name: "Binaural Beats",
        category: "Mindfulness",
        description: "Sound frequencies to enhance focus, relaxation, or sleep",
        instructions: "Use headphones to listen to specific frequency combinations. Choose alpha waves (8-14Hz) for focus, theta (4-8Hz) for meditation.",
        timeRequired: "20 minutes",
        difficulty: "Beginner",
        benefits: "Enhanced focus, deeper meditation, improved sleep, reduced anxiety",
        equipmentNeeded: "Headphones and audio device",
        scientificBacking: "EEG studies show brainwave entrainment effects",
        imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      }
    ];

    await db.insert(biohacks).values(initialBiohacks);
  }

  // Analytics operations
  async getDashboardStats(userId: string): Promise<{
    currentStreak: number;
    habitsCompletedToday: number;
    totalHabitsToday: number;
    wellnessScore: number;
    weeklyProgress: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    
    // Get active habits
    const activeHabits = await this.getUserHabits(userId);
    const totalHabitsToday = activeHabits.length;

    // Get today's completions
    const todayCompletions = await this.getHabitCompletions(userId, undefined, today);
    const habitsCompletedToday = todayCompletions.length;

    // Calculate current streak (longest streak among all habits)
    let currentStreak = 0;
    for (const habit of activeHabits) {
      const streak = await this.getHabitStreak(habit.id, userId);
      currentStreak = Math.max(currentStreak, streak);
    }

    // Get recent metrics for wellness score
    const recentMetrics = await this.getRecentMetrics(userId, 7);
    let wellnessScore = 5.0;
    if (recentMetrics.length > 0) {
      const avgEnergy = recentMetrics.reduce((sum, m) => sum + m.energy, 0) / recentMetrics.length;
      const avgFocus = recentMetrics.reduce((sum, m) => sum + m.focus, 0) / recentMetrics.length;
      const avgMood = recentMetrics.reduce((sum, m) => sum + m.mood, 0) / recentMetrics.length;
      const avgProductivity = recentMetrics.reduce((sum, m) => sum + m.productivity, 0) / recentMetrics.length;
      const avgSleep = recentMetrics.reduce((sum, m) => sum + m.sleepQuality, 0) / recentMetrics.length;
      
      wellnessScore = (avgEnergy + avgFocus + avgMood + avgProductivity + avgSleep) / 5;
    }

    // Calculate weekly progress
    const weeklyProgress = totalHabitsToday > 0 
      ? Math.round((habitsCompletedToday / totalHabitsToday) * 100)
      : 0;

    return {
      currentStreak,
      habitsCompletedToday,
      totalHabitsToday,
      wellnessScore: Math.round(wellnessScore * 10) / 10,
      weeklyProgress
    };
  }

  // AI Recommendations operations
  async getAIRecommendations(userId: string): Promise<AIRecommendation[]> {
    return await db
      .select()
      .from(aiRecommendations)
      .where(eq(aiRecommendations.userId, userId))
      .orderBy(desc(aiRecommendations.createdAt));
  }

  async createAIRecommendation(userId: string, recommendation: Omit<InsertAIRecommendation, 'userId'>): Promise<AIRecommendation> {
    const [created] = await db
      .insert(aiRecommendations)
      .values({
        ...recommendation,
        userId
      })
      .returning();
    return created;
  }

  async clearAIRecommendations(userId: string): Promise<void> {
    await db
      .delete(aiRecommendations)
      .where(eq(aiRecommendations.userId, userId));
  }

  async markRecommendationAsRead(recommendationId: number, userId: string): Promise<void> {
    await db
      .update(aiRecommendations)
      .set({ isRead: true })
      .where(
        and(
          eq(aiRecommendations.id, recommendationId),
          eq(aiRecommendations.userId, userId)
        )
      );
  }

  async toggleRecommendationBookmark(recommendationId: number, userId: string): Promise<boolean> {
    // First get the current bookmark state
    const [current] = await db
      .select({ isBookmarked: aiRecommendations.isBookmarked })
      .from(aiRecommendations)
      .where(
        and(
          eq(aiRecommendations.id, recommendationId),
          eq(aiRecommendations.userId, userId)
        )
      );

    if (!current) {
      throw new Error("Recommendation not found");
    }

    const newBookmarkState = !current.isBookmarked;

    await db
      .update(aiRecommendations)
      .set({ isBookmarked: newBookmarkState })
      .where(
        and(
          eq(aiRecommendations.id, recommendationId),
          eq(aiRecommendations.userId, userId)
        )
      );

    return newBookmarkState;
  }

  // Beta Feedback operations
  async createBetaFeedback(feedback: InsertBetaFeedback): Promise<BetaFeedback> {
    const [newFeedback] = await db
      .insert(betaFeedback)
      .values(feedback)
      .returning();
    return newFeedback;
  }

  async getBetaFeedbackByUser(userId: string): Promise<BetaFeedback[]> {
    return await db
      .select()
      .from(betaFeedback)
      .where(eq(betaFeedback.userId, userId))
      .orderBy(desc(betaFeedback.createdAt));
  }

  async getAllBetaFeedback(): Promise<BetaFeedback[]> {
    return await db
      .select()
      .from(betaFeedback)
      .orderBy(desc(betaFeedback.createdAt));
  }

  async updateBetaFeedbackStatus(feedbackId: number, status: string): Promise<void> {
    await db.update(betaFeedback)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(betaFeedback.id, feedbackId));
  }

  // Beta Signup operations
  async createBetaSignup(signup: InsertBetaSignup): Promise<BetaSignup> {
    const [newSignup] = await db
      .insert(betaSignups)
      .values(signup)
      .returning();
    return newSignup;
  }

  async getAllBetaSignups(): Promise<BetaSignup[]> {
    return await db
      .select()
      .from(betaSignups)
      .orderBy(desc(betaSignups.createdAt));
  }

  async updateBetaSignupStatus(signupId: number, status: string): Promise<boolean> {
    const result = await db
      .update(betaSignups)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(betaSignups.id, signupId));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
