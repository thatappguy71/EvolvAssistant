import { useQuery } from "@tanstack/react-query";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import BiohackCard from "@/components/BiohackCard";

export default function Biohacks() {
  const { isCollapsed } = useSidebar();
  const { data: biohacks = [], isLoading } = useQuery({
    queryKey: ['/api/biohacks'],
  });

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 pt-20 md:pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Biohacks</h1>
            <p className="text-gray-600 mt-1">Discover scientifically-backed techniques to optimize your health</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biohacks.map((biohack: any) => (
                <BiohackCard key={biohack.id} biohack={biohack} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
