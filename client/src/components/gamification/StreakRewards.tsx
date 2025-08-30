import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Flame, 
  Star, 
  Crown, 
  Shield, 
  Heart,
  Calendar,
  TrendingUp,
  Gift
} from "lucide-react";

interface StreakRewardsProps {
  currentStreak: number;
  longestStreak: number;
  totalHabitsCompleted: number;
}

export default function StreakRewards({ 
  currentStreak, 
  longestStreak, 
  totalHabitsCompleted 
}: StreakRewardsProps) {
  
  const milestones = [
    { days: 1, title: "First Step", icon: Shield, reward: "Recovery Warrior Badge", color: "bg-green-100 text-green-800" },
    { days: 7, title: "One Week Strong", icon: Calendar, reward: "Weekly Champion", color: "bg-blue-100 text-blue-800" },
    { days: 30, title: "Month Milestone", icon: Star, reward: "Monthly Master", color: "bg-purple-100 text-purple-800" },
    { days: 90, title: "Quarter Champion", icon: Award, reward: "90-Day Hero", color: "bg-orange-100 text-orange-800" },
    { days: 180, title: "Half-Year Hero", icon: Crown, reward: "Resilience Crown", color: "bg-red-100 text-red-800" },
    { days: 365, title: "Annual Achievement", icon: Crown, reward: "Year of Strength", color: "bg-yellow-100 text-yellow-800" }
  ];

  const getNextMilestone = () => {
    return milestones.find(m => m.days > currentStreak) || milestones[milestones.length - 1];
  };

  const getAchievedMilestones = () => {
    return milestones.filter(m => m.days <= currentStreak);
  };

  const nextMilestone = getNextMilestone();
  const achievedMilestones = getAchievedMilestones();
  const progressToNext = nextMilestone ? (currentStreak / nextMilestone.days) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Current Streak Display */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-orange-800">
            {currentStreak} Day{currentStreak !== 1 ? 's' : ''}
          </CardTitle>
          <p className="text-orange-700">Current Recovery Streak</p>
        </CardHeader>
        <CardContent>
          {nextMilestone && currentStreak < nextMilestone.days && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextMilestone.title}</span>
                <span>{nextMilestone.days - currentStreak} days to go</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <div className="text-center">
                <Badge className="bg-orange-100 text-orange-800">
                  Next: {nextMilestone.reward}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Recovery Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              const isAchieved = currentStreak >= milestone.days;
              const isCurrent = currentStreak >= milestone.days && 
                               (index === milestones.length - 1 || currentStreak < milestones[index + 1].days);
              
              return (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    isAchieved 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  } ${isCurrent ? 'ring-2 ring-green-400' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isAchieved ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{milestone.title}</div>
                      <div className="text-xs text-muted-foreground">{milestone.days} days</div>
                      <Badge className={`mt-1 text-xs ${isAchieved ? milestone.color : 'bg-gray-100 text-gray-600'}`}>
                        {milestone.reward}
                      </Badge>
                    </div>
                    {isAchieved && (
                      <div className="text-green-600">
                        <Award className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Summary */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{achievedMilestones.length}</div>
                <div className="text-sm text-muted-foreground">Milestones</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{longestStreak}</div>
                <div className="text-sm text-muted-foreground">Longest Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalHabitsCompleted}</div>
                <div className="text-sm text-muted-foreground">Total Habits</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}