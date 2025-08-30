import OpenAI from "openai";
import { db } from "./db";
import { users, habits, habitCompletions, dailyMetrics, biohacks, userBiohackBookmarks } from "@shared/schema";
import { eq, desc, gte } from "drizzle-orm";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface WellnessRecommendation {
  type: 'habit' | 'biohack' | 'insight' | 'goal';
  title: string;
  description: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  estimatedBenefit: string;
  timeCommitment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserWellnessData {
  userId: string;
  recentMetrics: any[];
  habitCompletions: any[];
  activeHabits: any[];
  bookmarkedBiohacks: any[];
  userGoals?: string[];
  currentChallenges?: string[];
}

export class AIWellnessService {
  
  async getUserWellnessData(userId: string): Promise<UserWellnessData> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get recent wellness metrics
    const recentMetrics = await db
      .select()
      .from(dailyMetrics)
      .where(eq(dailyMetrics.userId, userId))
      .orderBy(desc(dailyMetrics.date))
      .limit(30);

    // Get habit completions from last 30 days
    const userHabitCompletions = await db
      .select()
      .from(habitCompletions)
      .where(eq(habitCompletions.userId, userId))
      .orderBy(desc(habitCompletions.completedAt))
      .limit(100);

    // Get active habits
    const activeHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId));

    // Get bookmarked biohacks
    const userBookmarks = await db
      .select({
        biohack: biohacks
      })
      .from(userBiohackBookmarks)
      .innerJoin(biohacks, eq(userBiohackBookmarks.biohackId, biohacks.id))
      .where(eq(userBiohackBookmarks.userId, userId));

    const bookmarkedBiohacks = userBookmarks.map(b => b.biohack);

    return {
      userId,
      recentMetrics,
      habitCompletions: userHabitCompletions,
      activeHabits,
      bookmarkedBiohacks
    };
  }

  async generatePersonalizedRecommendations(userId: string): Promise<WellnessRecommendation[]> {
    try {
      const userData = await this.getUserWellnessData(userId);
      
      // Create a comprehensive analysis prompt
      const analysisPrompt = this.buildAnalysisPrompt(userData);

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an expert wellness coach and data analyst. Analyze user wellness data and provide personalized recommendations. 
            
            Focus on:
            - Identifying patterns in wellness metrics and recovery habits
            - Suggesting recovery-safe, evidence-based improvements
            - Recommending wellness tools that support addiction recovery
            - Providing insights about stress, triggers, and emotional patterns
            - Setting realistic recovery-focused goals based on current progress
            - Prioritizing mental health, stress management, and healthy coping mechanisms
            
            IMPORTANT: All recommendations must be recovery-safe and avoid any substances or activities that could trigger relapse. Focus on natural wellness, mindfulness, exercise, nutrition, sleep, and healthy social connections.
            
            Respond with JSON containing an array of recommendations. Each recommendation should be specific, actionable, recovery-focused, and tailored to the user's data patterns.`
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
      return this.validateAndFormatRecommendations(result.recommendations || []);

    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      console.error("Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      if ((error as any).message?.includes('API key')) {
        console.error("OpenAI API Key issue detected");
        throw new Error("OpenAI API configuration error");
      }
      const userData = await this.getUserWellnessData(userId);
      return this.getFallbackRecommendations(userData);
    }
  }

  private buildAnalysisPrompt(userData: UserWellnessData): string {
    const { recentMetrics, habitCompletions, activeHabits, bookmarkedBiohacks } = userData;
    
    // Calculate averages and trends
    const avgEnergy = this.calculateAverage(recentMetrics, 'energy');
    const avgFocus = this.calculateAverage(recentMetrics, 'focus');
    const avgMood = this.calculateAverage(recentMetrics, 'mood');
    const avgProductivity = this.calculateAverage(recentMetrics, 'productivity');
    const avgSleep = this.calculateAverage(recentMetrics, 'sleepQuality');

    const completionRate = this.calculateHabitCompletionRate(habitCompletions, activeHabits);
    
    const availableBiohacks = [
      "Recovery Breathing Technique", "Blue Light Blocking", "Box Breathing", "Recovery Cold Therapy",
      "Contrast Showers", "Dry Brushing", "Forest Bathing", "Gratitude Journaling",
      "Grounding (Earthing)", "Gentle Exercise", "Mindful Eating",
      "Meditation", "Morning Sunlight Exposure", "Red Light Therapy", "Sauna Therapy"
    ];

    return `
Analyze this user's wellness data and provide 3-5 personalized recommendations:

CURRENT WELLNESS METRICS (1-10 scale, last 30 days):
- Energy Level: ${avgEnergy.toFixed(1)} (${this.getTrendDescription(avgEnergy)})
- Focus: ${avgFocus.toFixed(1)} (${this.getTrendDescription(avgFocus)})
- Mood: ${avgMood.toFixed(1)} (${this.getTrendDescription(avgMood)})
- Productivity: ${avgProductivity.toFixed(1)} (${this.getTrendDescription(avgProductivity)})
- Sleep Quality: ${avgSleep.toFixed(1)} (${this.getTrendDescription(avgSleep)})

HABIT PERFORMANCE:
- Active Habits: ${activeHabits.length}
- Overall Completion Rate: ${(completionRate * 100).toFixed(1)}%
- Recent Activity: ${habitCompletions.length} completions in last 30 days

RECOVERY CONTEXT:
This user is in addiction recovery. All recommendations must be:
- Substance-free and recovery-safe
- Focused on building healthy coping mechanisms
- Supportive of mental health and emotional regulation
- Encouraging of social connection and support systems
- Mindful of potential triggers or high-risk situations

INTERESTS (Bookmarked Biohacks):
${bookmarkedBiohacks.map(b => `- ${b.name}: ${b.description.substring(0, 100)}...`).join('\n')}

AVAILABLE BIOHACKS TO RECOMMEND:
${availableBiohacks.join(', ')}

Please provide RECOVERY-SAFE recommendations in this JSON format:
{
  "recommendations": [
    {
      "type": "habit|biohack|insight|goal",
      "title": "Specific recommendation title",
      "description": "Detailed description of what to do",
      "reasoning": "Why this recommendation based on the user's data",
      "priority": "high|medium|low",
      "actionable": true,
      "estimatedBenefit": "Expected improvement",
      "timeCommitment": "Time required (if applicable)",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}

Focus on the lowest-performing metrics and suggest specific, actionable improvements.
    `;
  }

  private calculateAverage(metrics: any[], field: string): number {
    if (metrics.length === 0) return 5; // Default middle value
    const sum = metrics.reduce((acc, metric) => acc + (metric[field] || 5), 0);
    return sum / metrics.length;
  }

  private calculateHabitCompletionRate(completions: any[], habits: any[]): number {
    if (habits.length === 0) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCompletions = completions.filter(c => 
      new Date(c.completedAt) >= thirtyDaysAgo
    ).length;
    
    const expectedCompletions = habits.length * 30; // Assuming daily habits
    return expectedCompletions > 0 ? recentCompletions / expectedCompletions : 0;
  }

  private getTrendDescription(value: number): string {
    if (value >= 8) return "excellent";
    if (value >= 7) return "good";
    if (value >= 6) return "fair";
    if (value >= 4) return "below average";
    return "needs attention";
  }

  private validateAndFormatRecommendations(recommendations: any[]): WellnessRecommendation[] {
    return recommendations
      .filter(rec => rec.title && rec.description && rec.reasoning)
      .slice(0, 5) // Limit to 5 recommendations
      .map(rec => ({
        type: rec.type || 'insight',
        title: rec.title,
        description: rec.description,
        reasoning: rec.reasoning,
        priority: rec.priority || 'medium',
        actionable: rec.actionable !== false,
        estimatedBenefit: rec.estimatedBenefit || 'Improved wellness',
        timeCommitment: rec.timeCommitment,
        difficulty: rec.difficulty
      }));
  }

  private getFallbackRecommendations(_userData: UserWellnessData): WellnessRecommendation[] {
    // Provide basic recommendations if AI fails
    return [
      {
        type: 'habit',
        title: 'Build Recovery Morning Routine',
        description: 'Begin each day with a recovery-focused routine including meditation, gratitude, and intention setting for sobriety.',
        reasoning: 'Morning routines provide structure and purpose, which are crucial for maintaining recovery and preventing relapse.',
        priority: 'high',
        actionable: true,
        estimatedBenefit: 'Stronger recovery foundation and reduced relapse risk',
        timeCommitment: '15-30 minutes',
        difficulty: 'beginner'
      },
      {
        type: 'habit',
        title: 'Daily Recovery Check-in',
        description: 'End each day by reflecting on recovery progress, challenges faced, and gratitude for another day sober.',
        reasoning: 'Daily reflection helps process emotions, identify triggers, and reinforce recovery commitment.',
        priority: 'medium',
        actionable: true,
        estimatedBenefit: 'Better emotional processing and stronger recovery mindset',
        timeCommitment: '10-15 minutes',
        difficulty: 'beginner'
      }
    ];
  }
}

export const aiWellnessService = new AIWellnessService();