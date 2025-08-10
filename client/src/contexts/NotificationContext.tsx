import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'achievement' | 'update' | 'report';
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
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

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('evolv-notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('evolv-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}