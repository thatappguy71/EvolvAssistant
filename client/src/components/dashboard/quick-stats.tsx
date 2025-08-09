import { Card, CardContent } from "@/components/ui/card";
import { Flame, CheckCircle, Heart, Target } from "lucide-react";

interface QuickStatsProps {
  stats: {
    totalHabits: number;
    completedToday: number;
    currentStreak: number;
    weeklyProgress: number;
    averageWellnessScore: number;
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  const completionPercentage = stats.totalHabits > 0 
    ? Math.round((stats.completedToday / stats.totalHabits) * 100) 
    : 0;

  const statsCards = [
    {
      title: "Current Streak",
      value: stats.currentStreak,
      unit: "",
      subtitle: "+2 from yesterday",
      icon: Flame,
      iconColor: "text-orange-500",
      iconBg: "text-orange-500",
      trend: "positive"
    },
    {
      title: "Habits Completed",
      value: `${stats.completedToday}/${stats.totalHabits}`,
      unit: "",
      subtitle: `${completionPercentage}% completion`,
      icon: CheckCircle,
      iconColor: "text-green-500",
      iconBg: "text-green-500",
      trend: "positive"
    },
    {
      title: "Wellness Score",
      value: stats.averageWellnessScore,
      unit: "",
      subtitle: "Excellent range",
      icon: Heart,
      iconColor: "text-red-500",
      iconBg: "text-red-500",
      trend: "positive"
    },
    {
      title: "Weekly Goal",
      value: stats.weeklyProgress,
      unit: "%",
      subtitle: "On track",
      icon: Target,
      iconColor: "text-purple-500",
      iconBg: "text-purple-500",
      trend: "positive"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card 
          key={index} 
          className="hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}{stat.unit}
                </p>
                <p className="text-sm text-green-600 mt-1">{stat.subtitle}</p>
              </div>
              <div className="text-3xl">
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
