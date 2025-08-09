import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { 
  insertHabitSchema, 
  insertHabitCompletionSchema, 
  insertDailyMetricsSchema 
} from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const uploadDir = 'uploads/profile-images';
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error as Error, '');
      }
    },
    filename: (req, file, cb) => {
      const userId = (req as any).user?.claims?.sub;
      const ext = path.extname(file.originalname);
      cb(null, `${userId}-${Date.now()}${ext}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // Serve uploaded images
  app.use('/uploads', express.static('uploads'));

  // Initialize biohacks data
  await storage.initializeBiohacks();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile picture upload
  app.post('/api/user/profile-image', isAuthenticated, upload.single('profileImage'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const userId = req.user.claims.sub;
      const imageUrl = `/uploads/${req.file.filename}`;
      
      await storage.updateUserProfileImage(userId, imageUrl);
      
      res.json({ 
        message: 'Profile image updated successfully',
        imageUrl 
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ message: 'Failed to upload profile image' });
    }
  });

  // Update user profile
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName } = req.body;
      
      if (!firstName && !lastName) {
        return res.status(400).json({ message: 'At least one field must be provided' });
      }
      
      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      
      await storage.updateUserProfile(userId, updateData);
      
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // Subscription upgrade
  app.post('/api/subscription/upgrade', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { planType } = req.body;
      
      if (!planType || !['monthly', 'yearly'].includes(planType)) {
        return res.status(400).json({ message: 'Valid plan type (monthly or yearly) is required' });
      }
      
      // In a real app, you would integrate with Stripe, PayPal, or another payment processor
      // For demo purposes, we'll simulate a successful upgrade
      await storage.upgradeUserSubscription(userId, planType);
      
      res.json({ 
        message: 'Subscription upgraded successfully',
        planType,
        // In production, you would return a checkout URL from your payment processor
        // checkoutUrl: 'https://checkout.stripe.com/...'
      });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      res.status(500).json({ message: 'Failed to upgrade subscription' });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Habit routes
  app.get('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habits = await storage.getUserHabits(userId);
      res.json(habits);
    } catch (error) {
      console.error("Error fetching habits:", error);
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(userId, habitData);
      res.status(201).json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid habit data", errors: error.errors });
      } else {
        console.error("Error creating habit:", error);
        res.status(500).json({ message: "Failed to create habit" });
      }
    }
  });

  app.put('/api/habits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = parseInt(req.params.id);
      const habitData = insertHabitSchema.partial().parse(req.body);
      const habit = await storage.updateHabit(habitId, userId, habitData);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      res.json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid habit data", errors: error.errors });
      } else {
        console.error("Error updating habit:", error);
        res.status(500).json({ message: "Failed to update habit" });
      }
    }
  });

  app.delete('/api/habits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = parseInt(req.params.id);
      const success = await storage.deleteHabit(habitId, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting habit:", error);
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Habit completion routes
  app.post('/api/habits/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = parseInt(req.params.id);
      const completionData = {
        habitId,
        completedAt: new Date(),
        ...req.body
      };
      
      const completion = await storage.createHabitCompletion(userId, completionData);
      res.status(201).json(completion);
    } catch (error) {
      console.error("Error completing habit:", error);
      res.status(500).json({ message: "Failed to complete habit" });
    }
  });

  app.delete('/api/habits/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = parseInt(req.params.id);
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      
      const success = await storage.deleteHabitCompletion(habitId, userId, date);
      
      if (!success) {
        return res.status(404).json({ message: "Completion not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error removing habit completion:", error);
      res.status(500).json({ message: "Failed to remove habit completion" });
    }
  });

  app.get('/api/habits/:id/completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = parseInt(req.params.id);
      const completions = await storage.getHabitCompletions(userId, habitId);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching habit completions:", error);
      res.status(500).json({ message: "Failed to fetch habit completions" });
    }
  });

  app.get('/api/habits/:id/streak', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = parseInt(req.params.id);
      const streak = await storage.getHabitStreak(habitId, userId);
      res.json({ streak });
    } catch (error) {
      console.error("Error fetching habit streak:", error);
      res.status(500).json({ message: "Failed to fetch habit streak" });
    }
  });

  // Daily metrics routes
  app.get('/api/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const date = req.query.date as string;
      const metrics = await storage.getDailyMetrics(userId, date);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching daily metrics:", error);
      res.status(500).json({ message: "Failed to fetch daily metrics" });
    }
  });

  app.get('/api/metrics/recent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const days = parseInt(req.query.days as string) || 30;
      const metrics = await storage.getRecentMetrics(userId, days);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching recent metrics:", error);
      res.status(500).json({ message: "Failed to fetch recent metrics" });
    }
  });

  app.post('/api/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metricsData = insertDailyMetricsSchema.parse(req.body);
      const metrics = await storage.upsertDailyMetrics(userId, metricsData);
      res.json(metrics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid metrics data", errors: error.errors });
      } else {
        console.error("Error saving daily metrics:", error);
        res.status(500).json({ message: "Failed to save daily metrics" });
      }
    }
  });

  // Biohack routes
  app.get('/api/biohacks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const category = req.query.category as string;
      
      let biohacks;
      if (category) {
        biohacks = await storage.getBiohacksByCategory(category);
      } else {
        biohacks = await storage.getUserBookmarkedBiohacks(userId);
      }
      
      res.json(biohacks);
    } catch (error) {
      console.error("Error fetching biohacks:", error);
      res.status(500).json({ message: "Failed to fetch biohacks" });
    }
  });

  app.post('/api/biohacks/:id/bookmark', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const biohackId = parseInt(req.params.id);
      const isBookmarked = await storage.toggleBiohackBookmark(userId, biohackId);
      res.json({ isBookmarked });
    } catch (error) {
      console.error("Error toggling biohack bookmark:", error);
      res.status(500).json({ message: "Failed to toggle biohack bookmark" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
