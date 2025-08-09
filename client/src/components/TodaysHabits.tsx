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
  
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['/api/habits'],
  });

  const { data: completions = [] } = useQuery({
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Today's Habits</h2>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Today's Habits</h2>
        <Button variant="ghost" className="text-primary hover:text-blue-700 text-sm font-medium">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-plus-circle text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No habits yet. Create your first habit to get started!</p>
          </div>
        ) : (
          habits.map((habit: Habit) => {
            const isCompleted = isHabitCompleted(habit.id);
            const streak = getHabitStreak(habit.id);
            
            return (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary transition-all hover:shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <button
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'border-secondary bg-secondary'
                        : 'border-gray-300 hover:border-secondary'
                    }`}
                    onClick={() => toggleHabitMutation.mutate({ habitId: habit.id, isCompleted })}
                    disabled={toggleHabitMutation.isPending}
                  >
                    {isCompleted && <i className="fas fa-check text-white text-xs"></i>}
                  </button>
                  <div>
                    <h3 className="font-medium text-gray-900">{habit.name}</h3>
                    <p className="text-sm text-gray-500">{habit.timeRequired} • {habit.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    streak > 0 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {streak} day streak
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-ellipsis-h"></i>
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
