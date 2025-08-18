import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Clock, Edit, Trash2, ArrowRight } from "lucide-react";
import HabitModal from "@/components/HabitModal";
import { useLocation } from "wouter";

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
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
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
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
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

  const deleteHabitMutation = useMutation({
    mutationFn: async (habitId: number) => {
      await apiRequest('DELETE', `/api/habits/${habitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/habits/completions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Success",
        description: "Habit deleted successfully",
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
        description: "Failed to delete habit",
        variant: "destructive",
      });
    },
  });

  const getHabitStreak = (habitId: number) => {
    // This would need a separate API call or be included in the habits response
    return Math.floor(Math.random() * 20) + 1; // Placeholder
  };

  const handleHabitClick = (habit: any) => {
    setSelectedHabit(habit);
    setIsHabitDetailOpen(true);
  };

  const handleCloseHabitDetail = () => {
    setIsHabitDetailOpen(false);
    setSelectedHabit(null);
  };

  const handleEditHabit = (habit: any) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleDeleteHabit = (habitId: number) => {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      deleteHabitMutation.mutate(habitId);
    }
  };

  const handleCloseModal = () => {
    setIsHabitModalOpen(false);
    setEditingHabit(null);
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
        <Button 
          variant="ghost" 
          className="text-primary hover:text-blue-700 text-sm font-medium"
          onClick={() => setLocation('/habits')}
        >
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
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-all hover:shadow-sm cursor-pointer hover:scale-[1.02]"
                onClick={() => handleHabitClick(habit)}
              >
                <div className="flex items-center space-x-4">
                  <button
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHabitMutation.mutate({ habitId: habit.id, isCompleted });
                    }}
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
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Habit Detail Modal */}
      <Dialog open={isHabitDetailOpen} onOpenChange={setIsHabitDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedHabit?.name}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {selectedHabit?.category}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedHabit && (
            <div className="space-y-6">
              {/* Habit Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {selectedHabit.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Time Required</h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedHabit.timeRequired}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Difficulty</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedHabit.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      selectedHabit.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {selectedHabit.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Completion Status */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isHabitCompleted(selectedHabit.id) ? 'Completed today' : 'Mark as complete'}
                  </span>
                  <button
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isHabitCompleted(selectedHabit.id)
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400'
                    }`}
                    onClick={() => {
                      const isCompleted = isHabitCompleted(selectedHabit.id);
                      toggleHabitMutation.mutate({ habitId: selectedHabit.id, isCompleted });
                    }}
                    disabled={toggleHabitMutation.isPending}
                  >
                    {isHabitCompleted(selectedHabit.id) && <Check className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    handleCloseHabitDetail();
                    handleEditHabit(selectedHabit);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Habit
                </Button>
                
                <Button
                  onClick={() => {
                    handleCloseHabitDetail();
                    handleDeleteHabit(selectedHabit.id);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <HabitModal 
        isOpen={isHabitModalOpen} 
        onClose={handleCloseModal}
        habit={editingHabit}
      />
    </div>
  );
}
