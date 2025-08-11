import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  CheckCircle, 
  BarChart3, 
  Lightbulb, 
  Heart, 
  Crown, 
  Settings,
  Leaf,
  LogOut
} from "lucide-react";
import { useLocation } from "wouter";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Habits", href: "/habits", icon: CheckCircle },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Biohacks", href: "/biohacks", icon: Lightbulb },
    { name: "Wellness", href: "/wellness", icon: Heart },
  ];

  const accountNavigation = [
    { name: "Premium", href: "/premium", icon: Crown },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <aside className={cn("w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-30", className)}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-evolv-secondary to-evolv-success rounded-xl flex items-center justify-center">
            <Leaf className="text-white text-lg h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Evolv</h1>
            <p className="text-xs text-gray-500">Wellness Tracker</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        <div className="space-y-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setLocation(item.href)}
              className={cn(
                "w-full flex items-center space-x-3 rounded-lg px-4 py-3 text-left transition-all",
                location === item.href
                  ? "text-primary bg-blue-50"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50 hover:translate-x-1"
              )}
            >
              <item.icon className="text-lg h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
          <div className="space-y-2">
            {accountNavigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setLocation(item.href)}
                className={cn(
                  "w-full flex items-center space-x-3 rounded-lg px-4 py-3 text-left transition-all",
                  location === item.href
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50 hover:translate-x-1"
                )}
              >
                <item.icon className="text-lg h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3 mb-3">
          {user?.profileImageUrl && (
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName || user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500">Premium Member</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
