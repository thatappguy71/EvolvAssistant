import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "@/hooks/useLocation";
import { getRegionalContent, getRegionalizedHabit } from "@/utils/regionContent";

const categories = [
  "Mindfulness", "Exercise", "Learning", "Recovery", "Nutrition", "Sleep", "Focus", "Social", "Creative"
];

const predefinedHabits = [
  // Mindfulness
  { 
    name: "Morning Meditation", 
    category: "Mindfulness", 
    timeRequired: "10 minutes", 
    difficulty: "Easy", 
    description: "Start your day with 10 minutes of mindfulness meditation",
    helpfulLinks: [
      { title: "10-Minute Morning Meditation", url: "https://www.youtube.com/watch?v=ZToicYcHIOU", type: "video" },
      { title: "Headspace Morning Meditation", url: "https://www.headspace.com/meditation/morning-meditation", type: "guide" },
      { title: "Insight Timer Free Meditations", url: "https://insighttimer.com/meditation-topics/morning", type: "app" }
    ]
  },
  { 
    name: "Gratitude Journaling", 
    category: "Mindfulness", 
    timeRequired: "5 minutes", 
    difficulty: "Easy", 
    description: "Write down 3 things you're grateful for each day",
    helpfulLinks: [
      { title: "5-Minute Journal Method", url: "https://www.intelligentchange.com/blogs/read/the-five-minute-journal-method", type: "guide" },
      { title: "Gratitude Journal Prompts", url: "https://positivepsychology.com/gratitude-journal/", type: "resource" },
      { title: "Day One Journal App", url: "https://dayoneapp.com", type: "app" }
    ]
  },
  { 
    name: "Deep Breathing Exercise", 
    category: "Mindfulness", 
    timeRequired: "5 minutes", 
    difficulty: "Easy", 
    description: "Practice deep breathing to reduce stress and increase focus",
    helpfulLinks: [
      { title: "4-7-8 Breathing Technique", url: "https://www.youtube.com/watch?v=YRPh_GaiL8s", type: "video" },
      { title: "Box Breathing Guide", url: "https://www.healthline.com/health/box-breathing", type: "guide" },
      { title: "Breathe App for iPhone", url: "https://support.apple.com/en-us/HT206999", type: "app" }
    ]
  },
  { 
    name: "Evening Reflection", 
    category: "Mindfulness", 
    timeRequired: "10 minutes", 
    difficulty: "Easy", 
    description: "Reflect on the day's events and lessons learned",
    helpfulLinks: [
      { title: "Evening Reflection Questions", url: "https://www.lifehack.org/articles/lifestyle/21-questions-for-daily-self-reflection.html", type: "guide" },
      { title: "Guided Evening Meditation", url: "https://www.youtube.com/watch?v=WPPPFqsECz0", type: "video" },
      { title: "Reflectly Journal App", url: "https://reflectly.app", type: "app" }
    ]
  },
  
  // Exercise
  { 
    name: "Daily Walk", 
    category: "Exercise", 
    timeRequired: "30 minutes", 
    difficulty: "Easy", 
    description: "Take a brisk 30-minute walk outdoors",
    helpfulLinks: [
      { title: "Walking for Health Benefits", url: "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/walking/art-20046261", type: "guide" },
      { title: "MapMyWalk App", url: "https://www.mapmywalk.com", type: "app" },
      { title: "Local Walking Trails", url: "https://www.alltrails.com", type: "resource" }
    ]
  },
  { 
    name: "Morning Stretch", 
    category: "Exercise", 
    timeRequired: "15 minutes", 
    difficulty: "Easy", 
    description: "Gentle stretching routine to start the day",
    helpfulLinks: [
      { title: "15-Minute Morning Stretch", url: "https://www.youtube.com/watch?v=g_tea8ZNk5A", type: "video" },
      { title: "Morning Stretching Routine", url: "https://www.healthline.com/health/fitness/morning-stretches", type: "guide" },
      { title: "Daily Yoga App", url: "https://www.dailyyoga.com", type: "app" }
    ]
  },
  { 
    name: "Push-ups", 
    category: "Exercise", 
    timeRequired: "10 minutes", 
    difficulty: "Medium", 
    description: "Build upper body strength with daily push-ups",
    helpfulLinks: [
      { title: "Perfect Push-up Form", url: "https://www.youtube.com/watch?v=IODxDxX7oi4", type: "video" },
      { title: "100 Push-ups Training", url: "https://hundredpushups.com", type: "guide" },
      { title: "Push-ups Trainer App", url: "https://play.google.com/store/apps/details?id=com.northpark.pushups", type: "app" }
    ]
  },
  { 
    name: "Yoga Practice", 
    category: "Exercise", 
    timeRequired: "20 minutes", 
    difficulty: "Medium", 
    description: "Daily yoga flow for flexibility and strength",
    helpfulLinks: [
      { title: "20-Minute Yoga Flow", url: "https://www.youtube.com/watch?v=v7AYKMP6rOE", type: "video" },
      { title: "Yoga with Adriene", url: "https://yogawithadriene.com", type: "resource" },
      { title: "Down Dog Yoga App", url: "https://www.downdogapp.com", type: "app" }
    ]
  },
  { 
    name: "High-Intensity Workout", 
    category: "Exercise", 
    timeRequired: "45 minutes", 
    difficulty: "Hard", 
    description: "Intense workout session for maximum fitness gains",
    helpfulLinks: [
      { title: "HIIT Workout Guide", url: "https://www.youtube.com/watch?v=ml6cT4AZdqI", type: "video" },
      { title: "Nike Training Club", url: "https://www.nike.com/ntc-app", type: "app" },
      { title: "Fitness Blender HIIT", url: "https://www.fitnessblender.com/workouts-programs/workout-collections/hiit-workouts", type: "resource" }
    ]
  },
  
  // Nutrition
  { 
    name: "Drink 8 Glasses of Water", 
    category: "Nutrition", 
    timeRequired: "Throughout day", 
    difficulty: "Easy", 
    description: "Stay hydrated with adequate water intake",
    helpfulLinks: [
      { title: "Hydration Benefits Guide", url: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256", type: "guide" },
      { title: "WaterMinder App", url: "https://waterminder.com", type: "app" },
      { title: "Hydro Coach Water Tracker", url: "https://play.google.com/store/apps/details?id=com.northpark.drinkwater", type: "app" }
    ]
  },
  { 
    name: "Eat 5 Servings of Fruits/Vegetables", 
    category: "Nutrition", 
    timeRequired: "Throughout day", 
    difficulty: "Medium", 
    description: "Ensure proper nutrition with fruits and vegetables",
    helpfulLinks: [
      { title: "5-A-Day Guide", url: "https://www.nhs.uk/live-well/eat-well/5-a-day/", type: "guide" },
      { title: "Seasonal Produce Guide", url: "https://www.seasonalfoodguide.org", type: "resource" },
      { title: "MyFitnessPal App", url: "https://www.myfitnesspal.com", type: "app" }
    ]
  },
  { 
    name: "No Processed Sugar", 
    category: "Nutrition", 
    timeRequired: "All day", 
    difficulty: "Hard", 
    description: "Avoid processed sugars and refined sweeteners",
    helpfulLinks: [
      { title: "Hidden Sugars Guide", url: "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sugar/added-sugars", type: "guide" },
      { title: "Sugar-Free Recipes", url: "https://www.tasteofhome.com/collection/sugar-free-recipes/", type: "resource" },
      { title: "Sugar Smart App", url: "https://apps.apple.com/us/app/sugar-smart/id616689605", type: "app" }
    ]
  },
  { 
    name: "Intermittent Fasting", 
    category: "Nutrition", 
    timeRequired: "16 hours", 
    difficulty: "Hard", 
    description: "Practice 16:8 intermittent fasting schedule",
    helpfulLinks: [
      { title: "Intermittent Fasting Guide", url: "https://www.healthline.com/nutrition/intermittent-fasting-guide", type: "guide" },
      { title: "IF Beginner's Guide", url: "https://www.youtube.com/watch?v=4-3j_aTR6A8", type: "video" },
      { title: "Zero Fasting App", url: "https://www.zerofasting.com", type: "app" }
    ]
  },
  
  // Sleep
  { 
    name: "Sleep 8 Hours", 
    category: "Sleep", 
    timeRequired: "8 hours", 
    difficulty: "Medium", 
    description: "Get adequate restorative sleep each night",
    helpfulLinks: [
      { title: "Sleep Hygiene Tips", url: "https://www.sleepfoundation.org/sleep-hygiene", type: "guide" },
      { title: "Sleep Stories", url: "https://www.calm.com/sleep-stories", type: "resource" },
      { title: "Sleep Cycle App", url: "https://www.sleepcycle.com", type: "app" }
    ]
  },
  { 
    name: "No Screens Before Bed", 
    category: "Sleep", 
    timeRequired: "1 hour", 
    difficulty: "Medium", 
    description: "Avoid screens 1 hour before bedtime",
    helpfulLinks: [
      { title: "Blue Light and Sleep", url: "https://www.sleepfoundation.org/bedroom-environment/blue-light", type: "guide" },
      { title: "Digital Sunset Routine", url: "https://www.headspace.com/sleep/bedtime-routine", type: "resource" },
      { title: "Screen Time Controls", url: "https://support.apple.com/en-us/HT208982", type: "guide" }
    ]
  },
  { 
    name: "Consistent Sleep Schedule", 
    category: "Sleep", 
    timeRequired: "Daily", 
    difficulty: "Medium", 
    description: "Go to bed and wake up at the same time daily",
    helpfulLinks: [
      { title: "Circadian Rhythm Guide", url: "https://www.sleepfoundation.org/circadian-rhythm", type: "guide" },
      { title: "Sleep Schedule Tips", url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379", type: "resource" },
      { title: "Bedtime App", url: "https://support.apple.com/en-us/HT208655", type: "app" }
    ]
  },
  
  // Learning
  { 
    name: "Read for 30 Minutes", 
    category: "Learning", 
    timeRequired: "30 minutes", 
    difficulty: "Easy", 
    description: "Daily reading for personal growth and knowledge",
    helpfulLinks: [
      { title: "Goodreads Book Recommendations", url: "https://www.goodreads.com", type: "resource" },
      { title: "Speed Reading Techniques", url: "https://www.youtube.com/watch?v=ZwEquW_Yij0", type: "video" },
      { title: "Kindle App", url: "https://www.amazon.com/kindle-dbs/fd/kcp", type: "app" }
    ]
  },
  { 
    name: "Learn New Vocabulary", 
    category: "Learning", 
    timeRequired: "15 minutes", 
    difficulty: "Easy", 
    description: "Expand vocabulary with new words daily",
    helpfulLinks: [
      { title: "Vocabulary.com", url: "https://www.vocabulary.com", type: "resource" },
      { title: "Anki Flashcards", url: "https://apps.ankiweb.net", type: "app" },
      { title: "Word of the Day", url: "https://www.merriam-webster.com/word-of-the-day", type: "resource" }
    ]
  },
  { 
    name: "Practice a Skill", 
    category: "Learning", 
    timeRequired: "45 minutes", 
    difficulty: "Medium", 
    description: "Dedicate time to developing a new skill",
    helpfulLinks: [
      { title: "Coursera Online Courses", url: "https://www.coursera.org", type: "resource" },
      { title: "Khan Academy", url: "https://www.khanacademy.org", type: "resource" },
      { title: "Udemy Skills Courses", url: "https://www.udemy.com", type: "resource" }
    ]
  },
  
  // Focus
  { 
    name: "Single-Task Focus", 
    category: "Focus", 
    timeRequired: "2 hours", 
    difficulty: "Medium", 
    description: "Work on one task without distractions",
    helpfulLinks: [
      { title: "Pomodoro Technique Guide", url: "https://todoist.com/productivity-methods/pomodoro-technique", type: "guide" },
      { title: "Forest Focus App", url: "https://www.forestapp.cc", type: "app" },
      { title: "Deep Work by Cal Newport", url: "https://www.calnewport.com/books/deep-work/", type: "resource" }
    ]
  },
  { 
    name: "Digital Detox Hour", 
    category: "Focus", 
    timeRequired: "1 hour", 
    difficulty: "Medium", 
    description: "Take a break from all digital devices",
    helpfulLinks: [
      { title: "Digital Detox Benefits", url: "https://www.healthline.com/health/digital-detox", type: "guide" },
      { title: "Analog Activities List", url: "https://www.verywellmind.com/benefits-of-taking-a-break-from-social-media-5207424", type: "resource" },
      { title: "Moment Screen Time App", url: "https://inthemoment.io", type: "app" }
    ]
  },
  { 
    name: "Morning Planning", 
    category: "Focus", 
    timeRequired: "15 minutes", 
    difficulty: "Easy", 
    description: "Plan your day's priorities each morning",
    helpfulLinks: [
      { title: "Daily Planning Template", url: "https://www.todoist.com/productivity-methods/daily-planning", type: "guide" },
      { title: "Eisenhower Matrix", url: "https://todoist.com/productivity-methods/eisenhower-matrix", type: "resource" },
      { title: "Any.do Task Planner", url: "https://www.any.do", type: "app" }
    ]
  },
  
  // Recovery
  { 
    name: "Cold Shower", 
    category: "Recovery", 
    timeRequired: "5 minutes", 
    difficulty: "Hard", 
    description: "End shower with 2-3 minutes of cold water",
    helpfulLinks: [
      { title: "Cold Shower Benefits", url: "https://www.healthline.com/health/cold-shower-benefits", type: "guide" },
      { title: "Wim Hof Method", url: "https://www.wimhofmethod.com", type: "resource" },
      { title: "Cold Therapy Guide", url: "https://www.youtube.com/watch?v=pq6WHJzOkno", type: "video" }
    ]
  },
  { 
    name: "Sauna Session", 
    category: "Recovery", 
    timeRequired: "20 minutes", 
    difficulty: "Medium", 
    description: "Relax and recover in a sauna",
    helpfulLinks: [
      { title: "Sauna Health Benefits", url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/sauna/art-20493438", type: "guide" },
      { title: "Find Local Saunas", url: "https://www.yelp.com/search?find_desc=sauna", type: "resource" },
      { title: "Sauna Protocol Guide", url: "https://www.foundmyfitness.com/topics/sauna", type: "resource" }
    ]
  },
  { 
    name: "Massage or Self-Care", 
    category: "Recovery", 
    timeRequired: "30 minutes", 
    difficulty: "Easy", 
    description: "Treat yourself to relaxing self-care",
    helpfulLinks: [
      { title: "Self-Massage Techniques", url: "https://www.youtube.com/watch?v=ihO02wUzgkc", type: "video" },
      { title: "Self-Care Ideas", url: "https://www.healthline.com/health/self-care-strategies", type: "guide" },
      { title: "Soothe Massage App", url: "https://www.soothe.com", type: "app" }
    ]
  },
  
  // Social
  { 
    name: "Connect with a Friend", 
    category: "Social", 
    timeRequired: "30 minutes", 
    difficulty: "Easy", 
    description: "Reach out and connect with someone you care about",
    helpfulLinks: [
      { title: "Meaningful Conversation Starters", url: "https://conversationstartersworld.com/deep-conversation-starters/", type: "resource" },
      { title: "How to Be a Better Friend", url: "https://www.verywellmind.com/how-to-be-a-good-friend-1382877", type: "guide" },
      { title: "Marco Polo Video Chat", url: "https://www.marcopolo.me", type: "app" }
    ]
  },
  { 
    name: "Random Act of Kindness", 
    category: "Social", 
    timeRequired: "15 minutes", 
    difficulty: "Easy", 
    description: "Do something kind for another person",
    helpfulLinks: [
      { title: "Random Acts of Kindness Ideas", url: "https://www.randomactsofkindness.org/kindness-ideas", type: "resource" },
      { title: "Kindness Benefits Research", url: "https://www.verywellmind.com/kindness-and-mental-health-5323002", type: "guide" },
      { title: "Be My Eyes App", url: "https://www.bemyeyes.com", type: "app" }
    ]
  },
  
  // Creative
  { 
    name: "Creative Writing", 
    category: "Creative", 
    timeRequired: "30 minutes", 
    difficulty: "Medium", 
    description: "Express yourself through writing",
    helpfulLinks: [
      { title: "Writing Prompts Generator", url: "https://www.servicescape.com/writing-prompt-generator", type: "resource" },
      { title: "Creative Writing Exercises", url: "https://blog.reedsy.com/creative-writing-exercises/", type: "guide" },
      { title: "Scrivener Writing App", url: "https://www.literatureandlatte.com/scrivener/overview", type: "app" }
    ]
  },
  { 
    name: "Drawing or Sketching", 
    category: "Creative", 
    timeRequired: "25 minutes", 
    difficulty: "Easy", 
    description: "Create art through drawing or sketching",
    helpfulLinks: [
      { title: "Drawing Tutorials", url: "https://www.youtube.com/c/Proko", type: "video" },
      { title: "Daily Drawing Prompts", url: "https://www.sketchbook.com/blog/30-day-drawing-challenge/", type: "resource" },
      { title: "Procreate App", url: "https://procreate.art", type: "app" }
    ]
  },
];

const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  category: z.string().min(1, "Category is required"),
  timeRequired: z.string().min(1, "Time required is required"),
  description: z.string().optional(),
  difficulty: z.string().default("Easy"),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: any;
}

export default function HabitModal({ isOpen, onClose, habit }: HabitModalProps) {
  const [useCustom, setUseCustom] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location } = useLocation();

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || "",
      category: habit?.category || "",
      timeRequired: habit?.timeRequired || "",
      description: habit?.description || "",
      difficulty: habit?.difficulty || "Easy",
    },
  });

  const createHabitMutation = useMutation({
    mutationFn: async (data: HabitFormData) => {
      await apiRequest('POST', '/api/habits', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      form.reset();
      setSelectedHabit("");
      setUseCustom(false);
      onClose();
      toast({
        title: "Success",
        description: "Habit created successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive",
      });
    },
  });

  const handleHabitSelection = (habitName: string) => {
    const selectedHabitData = predefinedHabits.find(h => h.name === habitName);
    if (selectedHabitData) {
      form.setValue("name", selectedHabitData.name);
      form.setValue("category", selectedHabitData.category);
      form.setValue("timeRequired", selectedHabitData.timeRequired);
      form.setValue("description", selectedHabitData.description);
      form.setValue("difficulty", selectedHabitData.difficulty as "Easy" | "Medium" | "Hard");
      setSelectedHabit(habitName);
    }
  };

  const onSubmit = (data: HabitFormData) => {
    createHabitMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!habit && (
            <>
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  type="button"
                  variant={!useCustom ? "default" : "outline"}
                  onClick={() => setUseCustom(false)}
                  className="flex-1"
                >
                  Choose from List
                </Button>
                <Button
                  type="button"
                  variant={useCustom ? "default" : "outline"}
                  onClick={() => setUseCustom(true)}
                  className="flex-1"
                >
                  Create Custom
                </Button>
              </div>

              {!useCustom && !selectedHabit && (
                <div className="space-y-4 max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                  <div className="text-center mb-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Choose a Popular Habit
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">Click on any habit below to select it</p>
                  </div>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category}>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2 px-2 bg-white rounded py-1">
                          {category}
                        </h4>
                        <div className="grid gap-2">
                          {predefinedHabits
                            .filter(habit => habit.category === category)
                            .map((habit) => (
                              <button
                                key={habit.name}
                                type="button"
                                onClick={() => handleHabitSelection(habit.name)}
                                className="w-full text-left p-3 rounded-lg border transition-all hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm bg-white border-gray-200"
                              >
                                <div className="font-medium text-gray-900">{habit.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {habit.timeRequired} • {habit.difficulty}
                                </div>
                                <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {habit.description}
                                </div>
                                {habit.helpfulLinks && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {habit.helpfulLinks.slice(0, 2).map((link, index) => (
                                      <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        {link.type === 'video' ? '📹' : link.type === 'app' ? '📱' : '📖'} {link.title.split(' ').slice(0, 2).join(' ')}
                                      </span>
                                    ))}
                                    {habit.helpfulLinks.length > 2 && (
                                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                        +{habit.helpfulLinks.length - 2} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!useCustom && selectedHabit && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      Selected Habit
                    </Label>
                    <button
                      type="button"
                      onClick={() => setSelectedHabit("")}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change Selection
                    </button>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-gray-900 mb-2">
                      {predefinedHabits.find(h => h.name === selectedHabit)?.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {predefinedHabits.find(h => h.name === selectedHabit)?.description}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ {predefinedHabits.find(h => h.name === selectedHabit)?.timeRequired}</span>
                      <span>📊 {predefinedHabits.find(h => h.name === selectedHabit)?.difficulty}</span>
                      <span>📂 {predefinedHabits.find(h => h.name === selectedHabit)?.category}</span>
                    </div>
                    {(() => {
                      // Get regionalized habit data if available
                      const regionalizedHabit = getRegionalizedHabit(selectedHabit, location);
                      const links = regionalizedHabit?.helpfulLinks || predefinedHabits.find(h => h.name === selectedHabit)?.helpfulLinks;
                      
                      if (!links) return null;
                      
                      return (
                        <div className="mt-3 space-y-2">
                          <div className="text-sm font-medium text-gray-700">
                            Helpful Resources {location ? `(${location.country})` : ''}:
                          </div>
                          <div className="space-y-1">
                            {links.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                              >
                                <span className="text-base">
                                  {link.type === 'video' ? '📹' : link.type === 'app' ? '📱' : link.type === 'guide' ? '📖' : '🔗'}
                                </span>
                                <span>{link.title}</span>
                                <span className="text-xs text-gray-500 ml-auto capitalize">({link.type})</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                      💡 <strong>Tip:</strong> This habit will be automatically configured with all the details above. You can still customize the fields below if needed.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {(useCustom || selectedHabit || habit) && (
            <>
              <div>
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Meditation"
                  {...form.register("name")}
                  disabled={!useCustom && selectedHabit !== "" && !habit}
                  className={!useCustom && selectedHabit !== "" && !habit ? "bg-gray-100" : ""}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {useCustom && (
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => form.setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="Exercise">Exercise</SelectItem>
                      <SelectItem value="Learning">Learning</SelectItem>
                      <SelectItem value="Recovery">Recovery</SelectItem>
                      <SelectItem value="Nutrition">Nutrition</SelectItem>
                      <SelectItem value="Sleep">Sleep</SelectItem>
                      <SelectItem value="Focus">Focus</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>
              )}

              {useCustom && (
                <>
                  <div>
                    <Label htmlFor="timeRequired">Time Required</Label>
                    <Input
                      id="timeRequired"
                      placeholder="e.g., 15 minutes"
                      {...form.register("timeRequired")}
                    />
                    {form.formState.errors.timeRequired && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.timeRequired.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select onValueChange={(value) => form.setValue("difficulty", value)} 
                            defaultValue="Easy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your habit..."
                      {...form.register("description")}
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createHabitMutation.isPending || (!useCustom && !selectedHabit && !habit)}
              className="flex-1"
            >
              {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
