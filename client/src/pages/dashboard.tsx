import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import QuickStats from "@/components/QuickStats";
import TodaysHabits from "@/components/TodaysHabits";
import WellnessMetrics from "@/components/WellnessMetrics";
import BiohackCard from "@/components/BiohackCard";
import HabitModal from "@/components/HabitModal";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Bookmark, ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [selectedBiohack, setSelectedBiohack] = useState<any>(null);
  const [isBiohackDetailOpen, setIsBiohackDetailOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { isCollapsed } = useSidebar();

  const { data: stats } = useQuery<{
    currentStreak: number;
    habitsCompletedToday: number;
    totalHabitsToday: number;
    wellnessScore: number;
    weeklyProgress: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: biohacks = [] } = useQuery<any[]>({
    queryKey: ['/api/biohacks'],
  });

  const recommendedBiohacks = biohacks.slice(0, 3);

  const handleBiohackClick = (biohack: any) => {
    setSelectedBiohack(biohack);
    setIsBiohackDetailOpen(true);
  };

  const handleCloseBiohackDetail = () => {
    setIsBiohackDetailOpen(false);
    setSelectedBiohack(null);
  };

  const handleExploreAll = () => {
    setLocation('/biohacks');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
          <QuickStats stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TodaysHabits />
            </div>
            <div className="space-y-6">
              <WellnessMetrics />
            </div>
          </div>

          {/* Biohacks Discovery Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recommended Biohacks</h2>
              <Button 
                variant="ghost" 
                className="text-primary hover:text-blue-700 text-sm font-medium"
                onClick={handleExploreAll}
              >
                Explore All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedBiohacks.map((biohack: any) => (
                <BiohackCard 
                  key={biohack.id} 
                  biohack={biohack} 
                  onClick={handleBiohackClick}
                />
              ))}
            </div>
          </div>

          <AnalyticsCharts />
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        onClick={() => setIsHabitModalOpen(true)}
      >
        <i className="fas fa-plus text-xl"></i>
      </button>

      <HabitModal 
        isOpen={isHabitModalOpen} 
        onClose={() => setIsHabitModalOpen(false)} 
      />

      {/* Biohack Detail Modal */}
      <Dialog open={isBiohackDetailOpen} onOpenChange={setIsBiohackDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedBiohack?.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(selectedBiohack?.difficulty || '')}`}>
                {selectedBiohack?.difficulty}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBiohack && (
            <div className="space-y-6">
              {/* Biohack Image */}
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={selectedBiohack.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200"} 
                  alt={selectedBiohack.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Biohack Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedBiohack.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Time Required</h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedBiohack.timeRequired}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Category</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBiohack.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Benefits Section */}
                {selectedBiohack.benefits && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Benefits</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {selectedBiohack.benefits.split('\n').map((benefit: string, index: number) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions Section */}
                {selectedBiohack.instructions && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">How to Do It</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedBiohack.instructions.split('\n').map((instruction: string, index: number) => (
                        <p key={index} className="mb-2">{instruction}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={handleCloseBiohackDetail}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                
                <Button
                  onClick={handleExploreAll}
                  variant="default"
                  className="flex-1"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  View All Biohacks
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
