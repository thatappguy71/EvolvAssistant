import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AnalyticsCharts from "@/components/AnalyticsCharts";

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

          <AnalyticsCharts />
        </div>
      </main>
    </div>
  );
}
