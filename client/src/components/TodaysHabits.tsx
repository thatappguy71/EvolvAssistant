import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";

interface Habit {
  id: number;
  name: string;
  category: string;
  timeRequired: string;
  description: string;
}

interface HabitCompletion {
  id: number;
  habitId: number;
  completedAt: string;
}

export default function TodaysHabits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ['/api/habits'],
  });

  const { data: completions = [] } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/habits/completions'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/habits/completions?date=${today}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch completions');
      return response.json();
    },
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, isCompleted }: { habitId: number; isCompleted: boolean }) => {
      if (isCompleted) {
        await apiRequest('DELETE', `/api/habits/${habitId}/complete`);
      } else {
        await apiRequest('POST', `/api/habits/${habitId}/complete`, {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits/completions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
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
        description: "Failed to update habit completion",
        variant: "destructive",
      });
    },
  });

  const isHabitCompleted = (habitId: number) => {
    return completions.some((completion: HabitCompletion) => completion.habitId === habitId);
  };

  const getHabitStreak = (habitId: number) => {
    // This would need a separate API call or be included in the habits response
    return Math.floor(Math.random() * 20) + 1; // Placeholder
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Today's Habits</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Today's Habits</h2>
        <Button variant="ghost" className="text-primary hover:text-blue-700 text-sm font-medium">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">No habits yet. Create your first habit to get started!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted = isHabitCompleted(habit.id);
            const streak = getHabitStreak(habit.id);
            
            return (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-all hover:shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <button
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                    }`}
                    onClick={() => toggleHabitMutation.mutate({ habitId: habit.id, isCompleted })}
                    disabled={toggleHabitMutation.isPending}
                  >
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{habit.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{habit.timeRequired} • {habit.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    streak > 0 
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {streak} day streak
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
