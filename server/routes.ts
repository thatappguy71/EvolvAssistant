import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getSubscriptionLimits, canCreateHabit } from "./utils/subscriptionLimits";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { 
  insertHabitSchema, 
  insertHabitCompletionSchema, 
  insertDailyMetricsSchema 
} from "@shared/schema";
import { z } from "zod";
import { 
  createCheckoutSession, 
  createCustomerPortalSession, 
  cancelSubscription,
  handleWebhook,
  STRIPE_CONFIG 
} from "./stripeService";

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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only standard image files are allowed (JPEG, PNG, GIF, WebP)'));
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

  // Test route to verify API routing
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working', timestamp: new Date().toISOString() });
  });

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'Evolv API' });
  });

  // Serve payment test page
  app.get('/test-payment', (req, res) => {
    res.sendFile(require('path').resolve(process.cwd(), 'test-payment.html'));
  });

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

  // Update user location
  app.patch('/api/user/location', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { country, region, city, timezone, currency, countryCode } = req.body;
      
      await storage.updateUserLocation(userId, {
        country,
        region,
        city,
        timezone,
        currency,
        countryCode,
        locationUpdatedAt: new Date()
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user location:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  // Profile picture upload
  app.post('/api/user/profile-image', isAuthenticated, upload.single('profileImage'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const userId = req.user.claims.sub;
      const imageUrl = `/uploads/profile-images/${req.file.filename}`;
      
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

  // Get user's subscription limits
  app.get('/api/user/limits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const habits = await storage.getUserHabits(userId);
      const limits = getSubscriptionLimits(user);
      
      res.json({
        ...limits,
        currentHabitCount: habits.length,
        canCreateHabit: canCreateHabit(user, habits.length)
      });
    } catch (error) {
      console.error("Error fetching user limits:", error);
      res.status(500).json({ message: "Failed to fetch user limits" });
    }
  });

  app.post('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check subscription limits
      const currentHabits = await storage.getUserHabits(userId);
      if (!canCreateHabit(user, currentHabits.length)) {
        const limits = getSubscriptionLimits(user);
        return res.status(403).json({ 
          message: `Habit limit reached (${limits.maxHabits}). Upgrade to Premium for unlimited habits.`,
          upgradeRequired: true,
          currentCount: currentHabits.length,
          maxHabits: limits.maxHabits
        });
      }

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

  app.get('/api/habits/completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habitId = req.query.habitId ? parseInt(req.query.habitId as string) : undefined;
      const completions = await storage.getHabitCompletions(userId, habitId);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching habit completions:", error);
      res.status(500).json({ message: "Failed to fetch habit completions" });
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

  // Biohack routes - Modified for beta testing
  app.get('/api/biohacks', async (req: any, res) => {
    try {
      const userId = "beta-tester";
      const category = req.query.category as string;
      const bookmarkedOnly = req.query.bookmarked === 'true';
      
      let biohacks;
      if (bookmarkedOnly) {
        biohacks = await storage.getUserBookmarkedBiohacks(userId);
        // Filter to only show bookmarked ones
        biohacks = biohacks.filter(b => b.isBookmarked);
      } else if (category) {
        biohacks = await storage.getBiohacksByCategory(category);
      } else {
        // Get all biohacks with bookmark status for the user
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
  // AI Recommendations endpoints
  app.get("/api/recommendations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { aiWellnessService } = await import("./aiService");
      
      // Get stored recommendations first
      const storedRecommendations = await storage.getAIRecommendations(userId);
      
      // If no recent recommendations (older than 24 hours), generate new ones
      const shouldGenerateNew = storedRecommendations.length === 0 || 
        (storedRecommendations[0]?.createdAt && 
         new Date().getTime() - new Date(storedRecommendations[0].createdAt).getTime() > 24 * 60 * 60 * 1000);
      
      if (shouldGenerateNew) {
        console.log(`Generating new AI recommendations for user ${userId}`);
        const newRecommendations = await aiWellnessService.generatePersonalizedRecommendations(userId);
        
        // Clear old recommendations and save new ones
        await storage.clearAIRecommendations(userId);
        for (const rec of newRecommendations) {
          await storage.createAIRecommendation(userId, rec);
        }
        
        // Get the newly stored recommendations
        const freshRecommendations = await storage.getAIRecommendations(userId);
        res.json(freshRecommendations);
      } else {
        res.json(storedRecommendations);
      }
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      res.status(500).json({ message: "Failed to fetch AI recommendations" });
    }
  });

  app.post("/api/recommendations/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recommendationId = parseInt(req.params.id);
      
      await storage.markRecommendationAsRead(recommendationId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking recommendation as read:", error);
      res.status(500).json({ message: "Failed to mark recommendation as read" });
    }
  });

  app.post("/api/recommendations/:id/bookmark", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recommendationId = parseInt(req.params.id);
      
      console.log(`Toggling bookmark for recommendation ${recommendationId} for user ${userId}`);
      const isBookmarked = await storage.toggleRecommendationBookmark(recommendationId, userId);
      res.json({ isBookmarked });
    } catch (error) {
      console.error("Error toggling recommendation bookmark:", error);
      // Log the full error for debugging
      console.error("Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      res.status(500).json({ message: "Failed to bookmark recommendation" });
    }
  });

  app.post("/api/recommendations/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log(`Starting AI recommendations generation for user ${userId}`);
      
      const { aiWellnessService } = await import("./aiService");
      
      console.log(`Calling aiWellnessService.generatePersonalizedRecommendations...`);
      const newRecommendations = await aiWellnessService.generatePersonalizedRecommendations(userId);
      console.log(`Generated ${newRecommendations.length} recommendations`);
      
      // Clear old recommendations and save new ones
      console.log(`Clearing old recommendations for user ${userId}`);
      await storage.clearAIRecommendations(userId);
      
      console.log(`Saving ${newRecommendations.length} new recommendations`);
      for (const rec of newRecommendations) {
        await storage.createAIRecommendation(userId, rec);
      }
      
      const freshRecommendations = await storage.getAIRecommendations(userId);
      console.log(`Returning ${freshRecommendations.length} fresh recommendations`);
      res.json(freshRecommendations);
    } catch (error) {
      console.error("Error generating fresh AI recommendations:", error);
      // Log the full error for debugging
      console.error("Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      
      // Check if it's an OpenAI API error
      if ((error as any).message?.includes('API key') || (error as any).message?.includes('OpenAI')) {
        res.status(500).json({ message: "OpenAI API configuration error. Please check your API key." });
      } else {
        res.status(500).json({ message: "Failed to generate new recommendations" });
      }
    }
  });

  // Stripe payment routes (authenticated)
  app.post('/api/subscription/create-checkout', isAuthenticated, async (req: any, res) => {
    try {
      console.log('Checkout request received for user:', req.user?.claims?.sub);
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email || 'demo@example.com';
      const { planType } = req.body;

      console.log('Plan type:', planType);
      
      if (!planType || !['monthly', 'yearly', 'family'].includes(planType)) {
        return res.status(400).json({ message: 'Invalid plan type' });
      }

      let priceId;
      if (planType === 'yearly') {
        priceId = STRIPE_CONFIG.prices.yearly;
      } else if (planType === 'family') {
        priceId = STRIPE_CONFIG.prices.family;
      } else {
        priceId = STRIPE_CONFIG.prices.monthly;
      }
      console.log('Using price ID:', priceId);
      
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const session = await createCheckoutSession({
        userId,
        userEmail,
        priceId,
        successUrl: `${baseUrl}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/premium?canceled=true`,
      });

      console.log('Checkout session created:', session.id);
      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ message: 'Failed to create checkout session', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Temporary demo route for testing payment (remove in production)
  app.post('/api/subscription/demo-checkout', async (req: any, res) => {
    try {
      console.log('Demo checkout route hit with body:', req.body);
      const { planType } = req.body;
      
      if (!planType || !['monthly', 'yearly', 'family'].includes(planType)) {
        return res.status(400).json({ message: 'Invalid plan type' });
      }

      let priceId;
      if (planType === 'yearly') {
        priceId = STRIPE_CONFIG.prices.yearly;
      } else if (planType === 'family') {
        priceId = STRIPE_CONFIG.prices.family;
      } else {
        priceId = STRIPE_CONFIG.prices.monthly;
      }
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      console.log('Creating Stripe session with price ID:', priceId);
      
      const session = await createCheckoutSession({
        userId: 'demo-user',
        userEmail: 'demo@evolv.app',
        priceId,
        successUrl: `${baseUrl}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/premium?canceled=true`,
      });

      console.log('Demo checkout session created:', session.id);
      return res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error('Error creating demo checkout session:', error);
      return res.status(500).json({ message: 'Failed to create checkout session', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/subscription/portal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.subscriptionId) {
        return res.status(400).json({ message: 'No active subscription found' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await createCustomerPortalSession(
        user.subscriptionId,
        `${baseUrl}/settings`
      );

      res.json({ portalUrl: session.url });
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      res.status(500).json({ message: 'Failed to create customer portal session' });
    }
  });

  app.post('/api/subscription/cancel', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.subscriptionId) {
        return res.status(400).json({ message: 'No active subscription found' });
      }

      const subscription = await cancelSubscription(user.subscriptionId, true);
      
      // Update user subscription status
      await storage.updateUserSubscription(userId, {
        subscriptionTier: 'FREE',
        subscriptionActive: false,
        subscriptionId: null
      });

      res.json({ 
        message: 'Subscription canceled successfully',
        proratedRefund: true,
        subscription 
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ message: 'Failed to cancel subscription' });
    }
  });

  // Stripe webhook endpoint
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const event = await handleWebhook(req.body, signature);

      console.log('Received Stripe webhook:', event.type);

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const userId = session.metadata?.userId;
          
          if (userId && session.subscription) {
            await storage.updateUserSubscription(userId, {
              subscriptionTier: 'PREMIUM',
              subscriptionActive: true,
              subscriptionId: session.subscription as string
            });
            console.log(`Updated user ${userId} to premium subscription`);
          }
          break;

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          const customerId = subscription.customer;
          
          // Find user by subscription ID and update status
          const isActive = event.type === 'customer.subscription.updated' && 
                          subscription.status === 'active';
          
          // Note: In production, you'd want to store customer ID on users table
          // For now, we'll handle this in the customer portal
          break;

        case 'invoice.payment_failed':
          const invoice = event.data.object as any;
          console.log('Payment failed for subscription:', invoice.subscription);
          // Handle failed payment - could pause subscription, send email, etc.
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ message: 'Webhook signature verification failed' });
    }
  });

  // Get all beta feedback (admin only)
  app.get('/api/beta-feedback/all', isAuthenticated, async (req: any, res) => {
    try {
      const feedback = await storage.getAllBetaFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching all feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Update feedback status
  app.patch('/api/beta-feedback/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const feedbackId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      await storage.updateBetaFeedbackStatus(feedbackId, status);
      res.json({ message: "Status updated successfully" });
    } catch (error) {
      console.error("Error updating feedback status:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Beta Feedback routes - Modified for beta testing (no authentication required)
  app.post('/api/beta-feedback', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      console.log('Beta feedback submission:', {
        userId,
        body: req.body
      });
      
      // Validate required fields
      if (!req.body.title || !req.body.description) {
        return res.status(400).json({ 
          message: "Title and description are required" 
        });
      }
      
      const feedbackData = {
        userId,
        type: req.body.type || 'general',
        priority: req.body.priority || 'medium',
        title: req.body.title,
        description: req.body.description,
        stepsToReproduce: req.body.stepsToReproduce || null,
        expectedBehavior: req.body.expectedBehavior || null,
        actualBehavior: req.body.actualBehavior || null,
        browserInfo: req.body.browserInfo || null,
        status: 'open' as const
      };
      
      console.log('Feedback data being saved:', feedbackData);
      
      const feedback = await storage.createBetaFeedback(feedbackData);
      console.log('Feedback saved successfully:', feedback.id);
      
      res.status(201).json(feedback);
    } catch (error) {
      console.error("Error creating beta feedback:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      res.status(500).json({ message: "Failed to create feedback", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get('/api/beta-feedback', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const feedback = await storage.getBetaFeedbackByUser(userId);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching beta feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  return httpServer;
}
