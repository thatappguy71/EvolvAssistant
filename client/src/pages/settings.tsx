import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Bell, Moon, Globe, Shield, Database, Trash2, Sun } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { isCollapsed } = useSidebar();
  
  const [notifications, setNotifications] = useState({
    habitReminders: true,
    weeklyReports: true,
    achievementAlerts: false,
    emailDigest: true,
  });

  const [preferences, setPreferences] = useState({
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export started",
      description: "You will receive an email with your data shortly.",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} p-4 md:p-8 pt-16 md:pt-8 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Customize your Evolv experience and manage your preferences</p>
          </div>

          <div className="space-y-8">
            {/* Notifications Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Habit Reminders</Label>
                    <p className="text-sm text-gray-500">Get reminded to complete your daily habits</p>
                  </div>
                  <Switch
                    checked={notifications.habitReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, habitReminders: checked })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Receive weekly progress summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyReports: checked })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Achievement Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when you reach milestones</p>
                  </div>
                  <Switch
                    checked={notifications.achievementAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, achievementAlerts: checked })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Email Digest</Label>
                    <p className="text-sm text-gray-500">Receive daily email summaries</p>
                  </div>
                  <Switch
                    checked={notifications.emailDigest}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailDigest: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance & Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <CardTitle>Appearance & Preferences</CardTitle>
                </div>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={(value) => {
                      setTheme(value as 'light' | 'dark' | 'system');
                      toast({
                        title: "Theme updated",
                        description: `Theme changed to ${value}`,
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={preferences.language} onValueChange={(value) => 
                      setPreferences({ ...preferences, language: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={preferences.timezone} onValueChange={(value) => 
                      setPreferences({ ...preferences, timezone: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={preferences.dateFormat} onValueChange={(value) => 
                      setPreferences({ ...preferences, dateFormat: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
                <CardDescription>
                  Manage your privacy settings and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Profile Visibility</Label>
                    <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Data Analytics</Label>
                    <p className="text-sm text-gray-500">Allow anonymous usage analytics</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Marketing Communications</Label>
                    <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <CardTitle>Data Management</CardTitle>
                </div>
                <CardDescription>
                  Export or delete your personal data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Export Data</Label>
                    <p className="text-sm text-gray-500">Download a copy of all your data</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    Export Data
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Clear All Data</Label>
                    <p className="text-sm text-gray-500">Permanently delete all your tracking data</p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} size="lg">
                Save All Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}