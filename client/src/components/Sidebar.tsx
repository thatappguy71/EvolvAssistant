import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Settings, User, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, createContext, useContext } from "react";

// Create a context for sidebar state
type SidebarContextType = {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
      </Button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside className={`${
        isCollapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'w-64'
      } bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 fixed h-full z-30 transition-all duration-300 ease-in-out`}>
        
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 dark:border-gray-700 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <i className="fas fa-leaf text-white text-lg"></i>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Evolv</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Wellness Tracker</p>
              </div>
            )}
          </div>
          
          {/* Desktop toggle button */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
      
        {/* Expand button when collapsed */}
        {isCollapsed && (
          <div className="p-4 hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
              onClick={() => setIsCollapsed(false)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        )}

      <nav className={`mt-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className="space-y-2">
          <Link 
            href="/" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
              isActive("/") 
                ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            title={isCollapsed ? "Dashboard" : ""}
          >
            <i className="fas fa-home text-lg"></i>
            {!isCollapsed && <span className="font-medium">Dashboard</span>}
          </Link>
          <Link 
            href="/habits" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
              isActive("/habits") 
                ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            title={isCollapsed ? "Habits" : ""}
          >
            <i className="fas fa-check-circle text-lg"></i>
            {!isCollapsed && <span className="font-medium">Habits</span>}
          </Link>
          <Link 
            href="/analytics" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
              isActive("/analytics") 
                ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            title={isCollapsed ? "Analytics" : ""}
          >
            <i className="fas fa-chart-line text-lg"></i>
            {!isCollapsed && <span className="font-medium">Analytics</span>}
          </Link>
          <Link 
            href="/biohacks" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
              isActive("/biohacks") 
                ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            title={isCollapsed ? "Biohacks" : ""}
          >
            <i className="fas fa-lightbulb text-lg"></i>
            {!isCollapsed && <span className="font-medium">Biohacks</span>}
          </Link>
          <Link 
            href="/wellness" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
              isActive("/wellness") 
                ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            title={isCollapsed ? "Wellness" : ""}
          >
            <i className="fas fa-heart text-lg"></i>
            {!isCollapsed && <span className="font-medium">Wellness</span>}
          </Link>
        </div>
        
        {!isCollapsed && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Account</h3>
            <div className="space-y-2">
              <Link 
                href="/premium" 
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all ${
                  isActive("/premium") 
                    ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                    : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
              >
                <i className="fas fa-crown text-lg"></i>
                <span className="font-medium">Premium</span>
              </Link>
              <button 
                onClick={() => window.location.href = '/api/logout'} 
                className="w-full flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg px-4 py-3 transition-all text-left"
              >
                <i className="fas fa-sign-out-alt text-lg"></i>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
      
      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <img 
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
              alt="User profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.subscriptionTier === 'PREMIUM' ? 'Premium Member' : 'Free Member'}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </aside>
    </>
  );
}
