import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Phone, 
  MessageSquare, 
  Users, 
  Heart, 
  Shield,
  Calendar,
  BookOpen,
  Target,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";

interface QuickActionsProps {
  onAddHabit: () => void;
  recoveryDays?: number;
}

export default function QuickActions({ onAddHabit, recoveryDays = 0 }: QuickActionsProps) {
  const [, setLocation] = useLocation();

  const quickActions = [
    {
      title: "Add Recovery Habit",
      description: "Build a new healthy routine",
      icon: Plus,
      color: "bg-green-600 hover:bg-green-700",
      action: onAddHabit
    },
    {
      title: "Crisis Support",
      description: "24/7 help available",
      icon: Phone,
      color: "bg-red-600 hover:bg-red-700",
      action: () => setLocation('/recovery?action=crisis'),
      urgent: true
    },
    {
      title: "Daily Check-in",
      description: "How are you feeling today?",
      icon: Heart,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => setLocation('/wellness')
    },
    {
      title: "Find Meeting",
      description: "Locate support groups",
      icon: Users,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => setLocation('/recovery?action=meetings')
    }
  ];

  const motivationalMessages = [
    "Every day sober is a victory! 🏆",
    "You're stronger than your cravings 💪",
    "Progress, not perfection 🌱",
    "One day at a time ☀️",
    "Your recovery matters ❤️"
  ];

  const getMessage = () => {
    const index = recoveryDays % motivationalMessages.length;
    return motivationalMessages[index];
  };

  return (
    <div className="space-y-6">
      {/* Motivational Message */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-medium text-green-800">
            {getMessage()}
          </p>
          {recoveryDays > 0 && (
            <Badge className="mt-2 bg-green-100 text-green-800">
              Day {recoveryDays} of Recovery
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`h-20 flex-col space-y-2 text-white relative ${action.color}`}
                >
                  {action.urgent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                  <IconComponent className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Resources */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Recovery Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLocation('/recovery')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Recovery Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('https://www.aa.org/find-aa', '_blank')}
            >
              <Users className="h-4 w-4 mr-2" />
              Find AA Meetings
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('https://www.na.org/meetingsearch/', '_blank')}
            >
              <Users className="h-4 w-4 mr-2" />
              Find NA Meetings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}