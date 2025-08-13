import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Settings, User, LogOut, Menu, X, Sparkles } from "lucide-react";
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  
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

  const handleNavigation = (href: string) => {
    // Auto-collapse sidebar on mobile after navigation
    if (window.innerWidth < 768) { // md breakpoint
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile menu button - only show when sidebar is collapsed */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </Button>
      )}

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside className={`${
        isCollapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'w-64'
      } bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 fixed h-full z-30 transition-all duration-300 ease-in-out flex flex-col`}>
        
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 dark:border-gray-700 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {/* Close button for mobile */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden absolute top-4 right-4 text-gray-700 dark:text-gray-200"
              onClick={() => setIsCollapsed(true)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-evolv-secondary to-evolv-success rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 192 192" className="text-white">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M96 144 C96 122, 96 114, 101 105 C107 95, 120 88, 135 88" strokeWidth="6"/>
                  <path d="M135 88 L125 79 M135 88 L128 97" strokeWidth="6"/>
                  <path d="M85 114 C67 112, 58 101, 56 88 C79 86, 91 97, 85 114 Z" fill="currentColor" stroke="none"/>
                  <path d="M105 114 C123 112, 132 101, 134 88 C111 86, 99 97, 105 114 Z" fill="currentColor" stroke="none"/>
                  <path d="M68 148 Q96 158 125 148" strokeWidth="4" opacity="0.9"/>
                </g>
              </svg>
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

      <nav className={`mt-6 ${isCollapsed ? 'px-2' : 'px-4'} flex-1 overflow-y-auto`}>
        <div className="space-y-2">
          <Link 
            href="/" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
              isActive("/") 
                ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            title={isCollapsed ? "Dashboard" : ""}
            onClick={() => handleNavigation("/")}
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
            onClick={() => handleNavigation("/habits")}
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
            onClick={() => handleNavigation("/analytics")}
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
            onClick={() => handleNavigation("/biohacks")}
          >
            <i className="fas fa-lightbulb text-lg"></i>
            {!isCollapsed && <span className="font-medium">Biohacks</span>}
          </Link>
          <Link 
            href="/ai-recommendations" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
              isActive("/ai-recommendations") 
                ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            title={isCollapsed ? "AI Recommendations" : ""}
            onClick={() => handleNavigation("/ai-recommendations")}
          >
            <Sparkles className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">AI Recommendations</span>}
          </Link>
          <Link 
            href="/wellness" 
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
              isActive("/wellness") 
                ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
            title={isCollapsed ? "Wellness" : ""}
            onClick={() => handleNavigation("/wellness")}
          >
            <i className="fas fa-heart text-lg"></i>
            {!isCollapsed && <span className="font-medium">Wellness</span>}
          </Link>
          
          {/* Beta Testing Section */}
          <div className={`${isCollapsed ? 'px-2' : 'px-4'} pt-6 border-t border-gray-200 dark:border-gray-700 mt-6`}>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Beta Testing
              </p>
            )}
            <Link 
              href="/beta-feedback" 
              className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
                isActive("/beta-feedback") 
                  ? "text-orange-600 bg-orange-50 dark:bg-orange-900/50" 
                  : "text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30"
              }`}
              title={isCollapsed ? "Beta Feedback" : ""}
              onClick={() => handleNavigation("/beta-feedback")}
            >
              <i className="fas fa-comment-dots text-lg"></i>
              {!isCollapsed && <span className="font-medium">Beta Feedback</span>}
            </Link>
            <Link 
              href="/feedback-admin" 
              className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} rounded-lg py-3 transition-all ${
                isActive("/feedback-admin") 
                  ? "text-purple-600 bg-purple-50 dark:bg-purple-900/50" 
                  : "text-gray-600 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              }`}
              title={isCollapsed ? "Feedback Admin" : ""}
              onClick={() => handleNavigation("/feedback-admin")}
            >
              <i className="fas fa-cog text-lg"></i>
              {!isCollapsed && <span className="font-medium">Feedback Admin</span>}
            </Link>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Account</h3>
            <div className="space-y-2">
              <Link 
                href="/pricing" 
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all ${
                  isActive("/pricing") 
                    ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                    : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
                onClick={() => handleNavigation("/pricing")}
              >
                <i className="fas fa-tag text-lg"></i>
                <span className="font-medium">Pricing</span>
              </Link>
              <Link 
                href="/premium" 
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all ${
                  isActive("/premium") 
                    ? "text-primary bg-blue-50 dark:bg-blue-900/50" 
                    : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
                onClick={() => handleNavigation("/premium")}
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
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
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
                  <Link href="/profile" className="flex items-center w-full" onClick={() => handleNavigation("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center w-full" onClick={() => handleNavigation("/settings")}>
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
