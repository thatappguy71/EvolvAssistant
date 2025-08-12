import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
  { name: "Gratitude Journaling", category: "Mindfulness", timeRequired: "5 minutes", difficulty: "Easy", description: "Write down 3 things you're grateful for each day" },
  { name: "Deep Breathing Exercise", category: "Mindfulness", timeRequired: "5 minutes", difficulty: "Easy", description: "Practice deep breathing to reduce stress and increase focus" },
  { name: "Evening Reflection", category: "Mindfulness", timeRequired: "10 minutes", difficulty: "Easy", description: "Reflect on the day's events and lessons learned" },
  
  // Exercise
  { name: "Daily Walk", category: "Exercise", timeRequired: "30 minutes", difficulty: "Easy", description: "Take a brisk 30-minute walk outdoors" },
  { name: "Morning Stretch", category: "Exercise", timeRequired: "15 minutes", difficulty: "Easy", description: "Gentle stretching routine to start the day" },
  { name: "Push-ups", category: "Exercise", timeRequired: "10 minutes", difficulty: "Medium", description: "Build upper body strength with daily push-ups" },
  { name: "Yoga Practice", category: "Exercise", timeRequired: "20 minutes", difficulty: "Medium", description: "Daily yoga flow for flexibility and strength" },
  { name: "High-Intensity Workout", category: "Exercise", timeRequired: "45 minutes", difficulty: "Hard", description: "Intense workout session for maximum fitness gains" },
  
  // Nutrition
  { name: "Drink 8 Glasses of Water", category: "Nutrition", timeRequired: "Throughout day", difficulty: "Easy", description: "Stay hydrated with adequate water intake" },
  { name: "Eat 5 Servings of Fruits/Vegetables", category: "Nutrition", timeRequired: "Throughout day", difficulty: "Medium", description: "Ensure proper nutrition with fruits and vegetables" },
  { name: "No Processed Sugar", category: "Nutrition", timeRequired: "All day", difficulty: "Hard", description: "Avoid processed sugars and refined sweeteners" },
  { name: "Intermittent Fasting", category: "Nutrition", timeRequired: "16 hours", difficulty: "Hard", description: "Practice 16:8 intermittent fasting schedule" },
  
  // Sleep
  { name: "Sleep 8 Hours", category: "Sleep", timeRequired: "8 hours", difficulty: "Medium", description: "Get adequate restorative sleep each night" },
  { name: "No Screens Before Bed", category: "Sleep", timeRequired: "1 hour", difficulty: "Medium", description: "Avoid screens 1 hour before bedtime" },
  { name: "Consistent Sleep Schedule", category: "Sleep", timeRequired: "Daily", difficulty: "Medium", description: "Go to bed and wake up at the same time daily" },
  
  // Learning
  { name: "Read for 30 Minutes", category: "Learning", timeRequired: "30 minutes", difficulty: "Easy", description: "Daily reading for personal growth and knowledge" },
  { name: "Learn New Vocabulary", category: "Learning", timeRequired: "15 minutes", difficulty: "Easy", description: "Expand vocabulary with new words daily" },
  { name: "Practice a Skill", category: "Learning", timeRequired: "45 minutes", difficulty: "Medium", description: "Dedicate time to developing a new skill" },
  
  // Focus
  { name: "Single-Task Focus", category: "Focus", timeRequired: "2 hours", difficulty: "Medium", description: "Work on one task without distractions" },
  { name: "Digital Detox Hour", category: "Focus", timeRequired: "1 hour", difficulty: "Medium", description: "Take a break from all digital devices" },
  { name: "Morning Planning", category: "Focus", timeRequired: "15 minutes", difficulty: "Easy", description: "Plan your day's priorities each morning" },
  
  // Recovery
  { name: "Cold Shower", category: "Recovery", timeRequired: "5 minutes", difficulty: "Hard", description: "End shower with 2-3 minutes of cold water" },
  { name: "Sauna Session", category: "Recovery", timeRequired: "20 minutes", difficulty: "Medium", description: "Relax and recover in a sauna" },
  { name: "Massage or Self-Care", category: "Recovery", timeRequired: "30 minutes", difficulty: "Easy", description: "Treat yourself to relaxing self-care" },
  
  // Social
  { name: "Connect with a Friend", category: "Social", timeRequired: "30 minutes", difficulty: "Easy", description: "Reach out and connect with someone you care about" },
  { name: "Random Act of Kindness", category: "Social", timeRequired: "15 minutes", difficulty: "Easy", description: "Do something kind for another person" },
  
  // Creative
  { name: "Creative Writing", category: "Creative", timeRequired: "30 minutes", difficulty: "Medium", description: "Express yourself through writing" },
  { name: "Drawing or Sketching", category: "Creative", timeRequired: "25 minutes", difficulty: "Easy", description: "Create art through drawing or sketching" },
];

export function AddHabitModal({ open, onOpenChange }: AddHabitModalProps) {
  const [useCustom, setUseCustom] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    timeRequired: "",
    difficulty: "Easy" as "Easy" | "Medium" | "Hard",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createHabitMutation = useMutation({
    mutationFn: async (habitData: typeof formData) => {
      const response = await apiRequest("POST", "/api/habits", habitData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Success",
        description: "Habit created successfully",
      });
      onOpenChange(false);
      setFormData({
        name: "",
        category: "",
        description: "",
        timeRequired: "",
        difficulty: "Easy",
      });
      setSelectedHabit("");
      setUseCustom(false);
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
    const habit = predefinedHabits.find(h => h.name === habitName);
    if (habit) {
      setFormData({
        name: habit.name,
        category: habit.category,
        description: habit.description,
        timeRequired: habit.timeRequired,
        difficulty: habit.difficulty as "Easy" | "Medium" | "Hard",
      });
      setSelectedHabit(habitName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.timeRequired) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createHabitMutation.mutate(formData);
  };

  const categories = [
    "Mindfulness",
    "Exercise", 
    "Learning",
    "Recovery",
    "Nutrition",
    "Sleep",
    "Focus",
    "Social",
    "Creative"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                {predefinedHabits.find(h => h.name === selectedHabit)?.helpfulLinks && (
                  <div className="mt-3 space-y-2">
                    <div className="text-sm font-medium text-gray-700">Helpful Resources:</div>
                    <div className="space-y-1">
                      {predefinedHabits.find(h => h.name === selectedHabit)?.helpfulLinks?.map((link, index) => (
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
                )}
                <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                  💡 <strong>Tip:</strong> This habit will be automatically configured with all the details above. You can still customize the fields below if needed.
                </div>
              </div>
            </div>
          )}

          {(useCustom || selectedHabit) && (
            <>
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Habit Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Morning Meditation"
                  className={`mt-1 ${!useCustom && selectedHabit !== "" ? "bg-gray-100" : ""}`}
                  required
                  disabled={!useCustom && selectedHabit !== ""}
                />
              </div>

              {useCustom && (
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {useCustom && (
                <>
                  <div>
                    <Label htmlFor="timeRequired" className="text-sm font-medium text-gray-700">
                      Time Required *
                    </Label>
                    <Input
                      id="timeRequired"
                      type="text"
                      value={formData.timeRequired}
                      onChange={(e) => setFormData({ ...formData, timeRequired: e.target.value })}
                      placeholder="e.g., 15 minutes"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700">
                      Difficulty
                    </Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: "Easy" | "Medium" | "Hard") => 
                        setFormData({ ...formData, difficulty: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
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
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your habit..."
                      className="mt-1"
                      rows={3}
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
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createHabitMutation.isPending || (!useCustom && !selectedHabit)}
            >
              {createHabitMutation.isPending ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
