import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import HabitModal from "@/components/HabitModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Check, Clock, Edit, Trash2, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Habits() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const { isCollapsed } = useSidebar();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/habits'],
  });

  const { data: completions = [] } = useQuery({
    queryKey: ['/api/habits/completions'],
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
    return (completions as any[]).some((completion: any) => completion.habitId === habitId);
  };

  const deleteHabitMutation = useMutation({
    mutationFn: async (habitId: number) => {
      await apiRequest('DELETE', `/api/habits/${habitId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/habits/completions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Habit deleted",
        description: "Your habit has been successfully deleted.",
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

  const handleHabitClick = (habit: any) => {
    setSelectedHabit(habit);
    setIsHabitDetailOpen(true);
  };

  const handleCloseHabitDetail = () => {
    setIsHabitDetailOpen(false);
    setSelectedHabit(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 pt-20 md:pt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
              <p className="text-gray-600 mt-1">Manage and track your daily habits</p>
            </div>
            <Button 
              onClick={() => setIsHabitModalOpen(true)}
              className="bg-primary hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Habit
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-plus-circle text-6xl text-gray-300 mb-6"></i>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No habits yet</h2>
              <p className="text-gray-500 mb-8">Create your first habit to start your wellness journey!</p>
              <Button 
                onClick={() => setIsHabitModalOpen(true)}
                size="lg"
                className="bg-primary hover:bg-blue-700"
              >
                <i className="fas fa-plus mr-2"></i>
                Create Your First Habit
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(habits as any[]).map((habit: any) => {
                const isCompleted = isHabitCompleted(habit.id);
                return (
                  <Card 
                    key={habit.id} 
                    className="hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] border-l-4 border-l-primary/20 hover:border-l-primary"
                    onClick={() => handleHabitClick(habit)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className={isCompleted ? 'line-through text-gray-500' : ''}>{habit.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {habit.category}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{habit.description || 'No description'}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {habit.timeRequired}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            habit.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            habit.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {habit.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {isCompleted ? 'Completed today' : 'Click to view details'}
                        </span>
                        <button
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHabitMutation.mutate({ habitId: habit.id, isCompleted });
                          }}
                          disabled={toggleHabitMutation.isPending}
                        >
                          {isCompleted && <Check className="h-4 w-4" />}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <HabitModal 
        isOpen={isHabitModalOpen} 
        onClose={handleCloseModal}
      />

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
    </div>
  );
}
