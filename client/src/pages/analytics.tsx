import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import RecoveryAnalytics from "@/components/analytics/RecoveryAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 pt-20 md:pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Detailed insights into your wellness journey</p>
          </div>

          <Tabs defaultValue="recovery" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recovery">Recovery Analytics</TabsTrigger>
              <TabsTrigger value="wellness">Wellness Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recovery" className="space-y-6">
              <RecoveryAnalytics />
            </TabsContent>
            
            <TabsContent value="wellness" className="space-y-6">
              <AnalyticsCharts />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
