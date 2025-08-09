import { useAuth } from "@/hooks/useAuth";

export default function DashboardHeader() {
  const { user } = useAuth();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}, {userName}!
          </h1>
          <p className="text-gray-600 mt-1">Ready to continue your wellness journey?</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fas fa-bell text-xl"></i>
            <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="text-sm text-gray-500">
            <span>{currentDate}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
