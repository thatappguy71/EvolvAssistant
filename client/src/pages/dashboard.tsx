import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import QuickStats from "@/components/QuickStats";
import TodaysHabits from "@/components/TodaysHabits";
import WellnessMetrics from "@/components/WellnessMetrics";
import BiohackCard from "@/components/BiohackCard";
import HabitModal from "@/components/HabitModal";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: biohacks } = useQuery({
    queryKey: ['/api/biohacks'],
  });

  const recommendedBiohacks = biohacks?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-8 space-y-8">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recommended Biohacks</h2>
              <Button variant="ghost" className="text-primary hover:text-blue-700 text-sm font-medium">
                Explore All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedBiohacks.map((biohack) => (
                <BiohackCard key={biohack.id} biohack={biohack} />
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
    </div>
  );
}
