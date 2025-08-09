import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import HabitModal from "@/components/HabitModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Habits() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['/api/habits'],
  });

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-8">
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
              {habits.map((habit: any) => (
                <Card key={habit.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{habit.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {habit.category}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{habit.description || 'No description'}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span><i className="fas fa-clock mr-1"></i>{habit.timeRequired}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        habit.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        habit.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {habit.difficulty}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <HabitModal 
        isOpen={isHabitModalOpen} 
        onClose={() => setIsHabitModalOpen(false)} 
      />
    </div>
  );
}
