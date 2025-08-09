import {
  users,
  habits,
  habitCompletions,
  dailyMetrics,
  biohacks,
  userBiohackBookmarks,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  
  // Analytics operations
  getDashboardStats(userId: string): Promise<{
    currentStreak: number;
    habitsCompletedToday: number;
    totalHabitsToday: number;
    wellnessScore: number;
    weeklyProgress: number;
  }>;
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
    let query = db
      .select()
      .from(habitCompletions)
      .where(eq(habitCompletions.userId, userId));

    if (habitId) {
      query = query.where(eq(habitCompletions.habitId, habitId));
    }

    if (date) {
      query = query.where(sql`DATE(${habitCompletions.completedAt}) = ${date}`);
    }

    return await query.orderBy(desc(habitCompletions.completedAt));
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
    return result.rowCount > 0;
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
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200"
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
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200"
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
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200"
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
}

export const storage = new DatabaseStorage();
