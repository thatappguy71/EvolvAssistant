import { useState, useEffect } from 'react';

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    prompt: true
  });

  useEffect(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        prompt: currentPermission === 'default'
      });
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';
      
      setPermission({
        granted,
        denied: result === 'denied',
        prompt: result === 'default'
      });

      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission.granted) {
      new Notification(title, {
        icon: '/evolv-icon.svg',
        badge: '/evolv-icon.svg',
        ...options
      });
    }
  };

  const scheduleRecoveryReminder = (message: string, delayMinutes: number = 60) => {
    if (permission.granted) {
      setTimeout(() => {
        sendNotification('Recovery Check-in', {
          body: message,
          tag: 'recovery-reminder',
          requireInteraction: true
        });
      }, delayMinutes * 60 * 1000);
    }
  };

  const sendCrisisAlert = () => {
    if (permission.granted) {
      sendNotification('Crisis Support Available', {
        body: 'Tap to access immediate crisis resources and support',
        tag: 'crisis-support',
        requireInteraction: true,
        actions: [
          { action: 'crisis', title: 'Get Help Now' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      });
    }
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    scheduleRecoveryReminder,
    sendCrisisAlert
  };
}