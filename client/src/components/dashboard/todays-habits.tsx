import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Habit {
  id: number;
  name: string;
  category: string;
  timeRequired: string;
  difficulty: string;
  completed?: boolean;
}

interface TodaysHabitsProps {
  habits: Habit[];
}

export function TodaysHabits({ habits }: TodaysHabitsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleHabitMutation = useMutation({
    mutationFn: async (habitId: number) => {
      const response = await apiRequest("POST", `/api/habits/${habitId}/toggle`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
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

  const handleToggleHabit = (habitId: number) => {
    toggleHabitMutation.mutate(habitId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Today's Habits</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No habits found. Create your first habit to get started!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary transition-all hover:shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleHabit(habit.id)}
                    disabled={toggleHabitMutation.isPending}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      habit.completed
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 hover:border-green-500"
                    )}
                  >
                    {habit.completed && <Check className="h-3 w-3" />}
                  </button>
                  <div>
                    <h3 className="font-medium text-gray-900">{habit.name}</h3>
                    <p className="text-sm text-gray-500">
                      {habit.timeRequired} • {habit.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      habit.completed 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    12 day streak
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
