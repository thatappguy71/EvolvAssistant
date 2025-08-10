import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Check, X, Settings } from "lucide-react";

export default function DashboardHeader() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
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

  // Mock notifications data - in a real app this would come from an API
  const notifications = [
    {
      id: 1,
      title: "Habit Streak Milestone!",
      message: "Congratulations! You've completed 7 days in a row.",
      time: "2 hours ago",
      type: "achievement",
      read: false
    },
    {
      id: 2,
      title: "New Biohack Available",
      message: "Check out the latest breathing technique for better focus.",
      time: "1 day ago", 
      type: "update",
      read: false
    },
    {
      id: 3,
      title: "Weekly Report Ready",
      message: "Your wellness analytics for this week are now available.",
      time: "2 days ago",
      type: "report",
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setIsNotificationsOpen(true);
  };

  const handleViewSettings = () => {
    setIsNotificationsOpen(false);
    setLocation('/settings');
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {greeting()}, {userName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Ready to continue your wellness journey?</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Notifications</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewSettings}
                className="text-gray-500 hover:text-gray-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read
                      ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-medium text-sm ${
                          notification.read 
                            ? 'text-gray-900 dark:text-gray-100' 
                            : 'text-blue-900 dark:text-blue-100'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        notification.read 
                          ? 'text-gray-600 dark:text-gray-400' 
                          : 'text-blue-700 dark:text-blue-300'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {notification.type === 'achievement' && (
                        <span className="text-yellow-500">🏆</span>
                      )}
                      {notification.type === 'update' && (
                        <span className="text-blue-500">📢</span>
                      )}
                      {notification.type === 'report' && (
                        <span className="text-green-500">📊</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsNotificationsOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={handleViewSettings}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
