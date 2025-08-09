import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Settings, User, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-30">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <i className="fas fa-leaf text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Evolv</h1>
            <p className="text-xs text-gray-500">Wellness Tracker</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        <div className="space-y-2">
          <a href="/" className="flex items-center space-x-3 text-primary bg-blue-50 rounded-lg px-4 py-3 transition-all">
            <i className="fas fa-home text-lg"></i>
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="/habits" className="flex items-center space-x-3 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg px-4 py-3 transition-all">
            <i className="fas fa-check-circle text-lg"></i>
            <span className="font-medium">Habits</span>
          </a>
          <a href="/analytics" className="flex items-center space-x-3 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg px-4 py-3 transition-all">
            <i className="fas fa-chart-line text-lg"></i>
            <span className="font-medium">Analytics</span>
          </a>
          <a href="/biohacks" className="flex items-center space-x-3 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg px-4 py-3 transition-all">
            <i className="fas fa-lightbulb text-lg"></i>
            <span className="font-medium">Biohacks</span>
          </a>
          <a href="/wellness" className="flex items-center space-x-3 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg px-4 py-3 transition-all">
            <i className="fas fa-heart text-lg"></i>
            <span className="font-medium">Wellness</span>
          </a>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
          <div className="space-y-2">
            <a href="/premium" className="flex items-center space-x-3 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg px-4 py-3 transition-all">
              <i className="fas fa-crown text-lg"></i>
              <span className="font-medium">Premium</span>
            </a>
            <button 
              onClick={() => window.location.href = '/api/logout'} 
              className="w-full flex items-center space-x-3 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg px-4 py-3 transition-all text-left"
            >
              <i className="fas fa-sign-out-alt text-lg"></i>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <img 
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'User'}
            </p>
            <p className="text-xs text-gray-500">
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
    </aside>
  );
}
