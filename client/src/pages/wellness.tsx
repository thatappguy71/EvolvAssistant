import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WellnessMetrics from "@/components/WellnessMetrics";

export default function Wellness() {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <DashboardHeader />
        
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Wellness</h1>
            <p className="text-gray-600 mt-1">Track and monitor your daily wellness metrics</p>
          </div>

          <div className="max-w-md">
            <WellnessMetrics />
          </div>
        </div>
      </main>
    </div>
  );
}
