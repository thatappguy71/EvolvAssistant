import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Shield, 
  CheckCircle, 
  BarChart3, 
  Heart,
  Phone,
  Users
} from "lucide-react";

export default function MobileNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/", 
      color: "text-gray-600" 
    },
    { 
      icon: Shield, 
      label: "Recovery", 
      path: "/recovery", 
      color: "text-green-600",
      priority: true 
    },
    { 
      icon: CheckCircle, 
      label: "Habits", 
      path: "/habits", 
      color: "text-blue-600" 
    },
    { 
      icon: BarChart3, 
      label: "Progress", 
      path: "/analytics", 
      color: "text-purple-600" 
    },
    { 
      icon: Heart, 
      label: "Wellness", 
      path: "/wellness", 
      color: "text-red-600" 
    }
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  active 
                    ? `${item.color} bg-gray-50 dark:bg-gray-700` 
                    : "text-gray-400 hover:text-gray-600"
                } ${item.priority ? 'relative' : ''}`}
              >
                {item.priority && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
                <IconComponent className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Crisis Support Floating Button (Mobile) */}
      <Button
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg z-40 flex items-center justify-center"
        onClick={() => setLocation('/recovery?action=crisis')}
      >
        <Phone className="h-6 w-6" />
      </Button>

      {/* Mobile padding for bottom nav */}
      <div className="md:hidden h-16"></div>
    </>
  );
}