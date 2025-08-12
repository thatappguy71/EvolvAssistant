import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  serial,
  decimal,
  pgEnum,
  unique
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionTier: varchar("subscription_tier").default("FREE"),
  subscriptionId: varchar("subscription_id"),
  subscriptionActive: boolean("subscription_active").default(false),
  trialEndDate: timestamp("trial_end_date"),
  // Location fields for region-specific content
  country: varchar("country"),
  region: varchar("region"),
  city: varchar("city"),
  timezone: varchar("timezone"),
  currency: varchar("currency", { length: 3 }),
  countryCode: varchar("country_code", { length: 2 }),
  locationUpdatedAt: timestamp("location_updated_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userTierEnum = pgEnum('user_tier', ['FREE', 'PREMIUM', 'ENTERPRISE']);

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").default(""),
  timeRequired: varchar("time_required", { length: 50 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).default("Easy"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habitCompletions = pgTable("habit_completions", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull().references(() => habits.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  completedAt: timestamp("completed_at").notNull(),
  rating: integer("rating"),
  notes: text("notes").default(""),
});

export const dailyMetrics = pgTable("daily_metrics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  energy: integer("energy").notNull(),
  focus: integer("focus").notNull(),
  mood: integer("mood").notNull(),
  productivity: integer("productivity").notNull(),
  sleepQuality: integer("sleep_quality").notNull(),
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
  notes: text("notes").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique().on(table.userId, table.date)
]);

export const biohacks = pgTable("biohacks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  timeRequired: varchar("time_required", { length: 50 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  benefits: text("benefits").notNull(),
  equipmentNeeded: text("equipment_needed").default(""),
  scientificBacking: text("scientific_backing").default(""),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userBiohackBookmarks = pgTable("user_biohack_bookmarks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  biohackId: integer("biohack_id").notNull().references(() => biohacks.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  habits: many(habits),
  habitCompletions: many(habitCompletions),
  dailyMetrics: many(dailyMetrics),
  biohackBookmarks: many(userBiohackBookmarks),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  completions: many(habitCompletions),
}));

export const habitCompletionsRelations = relations(habitCompletions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitCompletions.habitId],
    references: [habits.id],
  }),
  user: one(users, {
    fields: [habitCompletions.userId],
    references: [users.id],
  }),
}));

export const dailyMetricsRelations = relations(dailyMetrics, ({ one }) => ({
  user: one(users, {
    fields: [dailyMetrics.userId],
    references: [users.id],
  }),
}));

export const biohacksRelations = relations(biohacks, ({ many }) => ({
  bookmarks: many(userBiohackBookmarks),
}));

export const userBiohackBookmarksRelations = relations(userBiohackBookmarks, ({ one }) => ({
  user: one(users, {
    fields: [userBiohackBookmarks.userId],
    references: [users.id],
  }),
  biohack: one(biohacks, {
    fields: [userBiohackBookmarks.biohackId],
    references: [biohacks.id],
  }),
}));

// Insert schemas
export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHabitCompletionSchema = createInsertSchema(habitCompletions).omit({
  id: true,
  userId: true,
});

export const insertDailyMetricsSchema = createInsertSchema(dailyMetrics).omit({
  id: true,
  userId: true,
  updatedAt: true,
});

export const insertBiohackSchema = createInsertSchema(biohacks).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Beta feedback table
export const betaFeedback = pgTable("beta_feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type", { enum: ["bug", "feature", "general", "usability"] }).notNull(),
  priority: varchar("priority", { enum: ["low", "medium", "high", "critical"] }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  stepsToReproduce: text("steps_to_reproduce"),
  expectedBehavior: text("expected_behavior"),
  actualBehavior: text("actual_behavior"),
  browserInfo: text("browser_info"),
  status: varchar("status", { enum: ["open", "in_progress", "resolved", "closed"] }).default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BetaFeedback = typeof betaFeedback.$inferSelect;
export type InsertBetaFeedback = typeof betaFeedback.$inferInsert;

// AI Recommendations table
export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: varchar("type").notNull(), // 'habit', 'biohack', 'insight', 'goal'
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  reasoning: text("reasoning").notNull(),
  priority: varchar("priority").notNull(), // 'high', 'medium', 'low'
  actionable: boolean("actionable").default(true),
  estimatedBenefit: varchar("estimated_benefit"),
  timeCommitment: varchar("time_commitment"),
  difficulty: varchar("difficulty"), // 'beginner', 'intermediate', 'advanced'
  isRead: boolean("is_read").default(false),
  isBookmarked: boolean("is_bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AIRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertAIRecommendation = typeof aiRecommendations.$inferInsert;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;
export type InsertHabitCompletion = z.infer<typeof insertHabitCompletionSchema>;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type InsertDailyMetrics = z.infer<typeof insertDailyMetricsSchema>;
export type DailyMetrics = typeof dailyMetrics.$inferSelect;
export type InsertBiohack = z.infer<typeof insertBiohackSchema>;
export type Biohack = typeof biohacks.$inferSelect;
export type UserBiohackBookmark = typeof userBiohackBookmarks.$inferSelect;
