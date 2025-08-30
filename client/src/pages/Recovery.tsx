import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Heart, 
  Users, 
  Phone, 
  Calendar, 
  BookOpen, 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Lightbulb,
  MessageSquare
} from "lucide-react";

export default function Recovery() {
  const { isCollapsed } = useSidebar();
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const { data: stats } = useQuery<{
    currentStreak: number;
    habitsCompletedToday: number;
    totalHabitsToday: number;
    wellnessScore: number;
    weeklyProgress: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
  });

  const recoveryResources = [
    {
      category: "Crisis Support",
      urgent: true,
      resources: [
        { name: "Crisis Text Line", contact: "Text HOME to 741741", description: "24/7 crisis support via text", type: "crisis" },
        { name: "National Suicide Prevention Lifeline", contact: "988", description: "24/7 suicide prevention and crisis support", type: "crisis" },
        { name: "SAMHSA National Helpline", contact: "1-800-662-4357", description: "24/7 treatment referral service", type: "crisis" },
        { name: "Talk Suicide Canada", contact: "1-833-456-4566", description: "24/7 bilingual crisis support", type: "crisis" }
      ]
    },
    {
      category: "Support Groups",
      urgent: false,
      resources: [
        { name: "Alcoholics Anonymous", contact: "aa.org", description: "12-step program for alcohol addiction", type: "support" },
        { name: "Narcotics Anonymous", contact: "na.org", description: "12-step program for drug addiction", type: "support" },
        { name: "SMART Recovery", contact: "smartrecovery.org", description: "Science-based addiction recovery program", type: "support" },
        { name: "Refuge Recovery", contact: "refugerecovery.org", description: "Buddhist-inspired recovery community", type: "support" }
      ]
    },
    {
      category: "Professional Help",
      urgent: false,
      resources: [
        { name: "Psychology Today", contact: "psychologytoday.com", description: "Find therapists specializing in addiction", type: "professional" },
        { name: "SAMHSA Treatment Locator", contact: "findtreatment.gov", description: "Find local treatment facilities", type: "professional" },
        { name: "Canadian Centre on Substance Use", contact: "ccsa.ca", description: "Canadian addiction resources and treatment", type: "professional" },
        { name: "Addiction Medicine Physicians", contact: "asam.org", description: "Find certified addiction medicine doctors", type: "professional" }
      ]
    }
  ];

  const recoveryMilestones = [
    { days: 1, title: "First Day", description: "You took the first step", color: "bg-green-100 text-green-800" },
    { days: 7, title: "One Week", description: "Building momentum", color: "bg-blue-100 text-blue-800" },
    { days: 30, title: "One Month", description: "Establishing new patterns", color: "bg-purple-100 text-purple-800" },
    { days: 90, title: "Three Months", description: "Significant progress", color: "bg-orange-100 text-orange-800" },
    { days: 180, title: "Six Months", description: "Halfway to a year", color: "bg-red-100 text-red-800" },
    { days: 365, title: "One Year", description: "Major milestone achieved", color: "bg-yellow-100 text-yellow-800" }
  ];

  const recoveryTools = [
    {
      name: "HALT Check",
      description: "Assess if you're Hungry, Angry, Lonely, or Tired - common relapse triggers",
      icon: AlertTriangle,
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      name: "Urge Surfing",
      description: "Mindfulness technique to ride out cravings without acting on them",
      icon: TrendingUp,
      color: "bg-blue-50 border-blue-200"
    },
    {
      name: "Recovery Affirmations",
      description: "Positive self-talk to reinforce your commitment to sobriety",
      icon: Heart,
      color: "bg-pink-50 border-pink-200"
    },
    {
      name: "Trigger Mapping",
      description: "Identify and plan responses to high-risk situations",
      icon: Target,
      color: "bg-purple-50 border-purple-200"
    }
  ];

  const currentStreak = stats?.currentStreak || 0;
  const nextMilestone = recoveryMilestones.find(m => m.days > currentStreak) || recoveryMilestones[recoveryMilestones.length - 1];
  const daysToNext = nextMilestone ? nextMilestone.days - currentStreak : 0;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 pt-20 md:pt-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recovery Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Your journey to wellness and freedom</p>
              </div>
            </div>
          </div>

          {/* Recovery Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                  <Award className="h-5 w-5 mr-2" />
                  Recovery Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{currentStreak}</div>
                    <div className="text-lg text-gray-700 dark:text-gray-300">
                      {currentStreak === 1 ? 'Day' : 'Days'} of Recovery
                    </div>
                    {daysToNext > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {daysToNext} days until {nextMilestone.title}
                      </div>
                    )}
                  </div>
                  
                  {nextMilestone && daysToNext > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to {nextMilestone.title}</span>
                        <span>{Math.round(((nextMilestone.days - daysToNext) / nextMilestone.days) * 100)}%</span>
                      </div>
                      <Progress 
                        value={((nextMilestone.days - daysToNext) / nextMilestone.days) * 100} 
                        className="h-3"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {recoveryMilestones.map((milestone, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg text-center ${
                          currentStreak >= milestone.days 
                            ? milestone.color + ' opacity-100' 
                            : 'bg-gray-100 text-gray-500 opacity-50'
                        }`}
                      >
                        <div className="font-semibold text-sm">{milestone.title}</div>
                        <div className="text-xs">{milestone.days} days</div>
                        {currentStreak >= milestone.days && (
                          <CheckCircle className="h-4 w-4 mx-auto mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Day Complete
                </Button>
                <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Journal Entry
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                  <Users className="h-4 w-4 mr-2" />
                  Find Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50">
                  <Phone className="h-4 w-4 mr-2" />
                  Crisis Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recovery Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Recovery Tools & Techniques
              </CardTitle>
              <CardDescription>
                Evidence-based tools to support your recovery journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recoveryTools.map((tool, index) => {
                  const IconComponent = tool.icon;
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${tool.color}`}
                      onClick={() => setSelectedResource(tool)}
                    >
                      <div className="flex items-center mb-3">
                        <IconComponent className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resources and Support */}
          <Tabs defaultValue="crisis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="crisis" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Crisis Support
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Support Groups
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Professional Help
              </TabsTrigger>
            </TabsList>

            {recoveryResources.map((category) => (
              <TabsContent key={category.category.toLowerCase().replace(' ', '')} value={category.category.toLowerCase().replace(' ', '')}>
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${category.urgent ? 'text-red-600' : 'text-blue-600'}`}>
                      {category.urgent ? <AlertTriangle className="h-5 w-5 mr-2" /> : <Users className="h-5 w-5 mr-2" />}
                      {category.category}
                    </CardTitle>
                    {category.urgent && (
                      <CardDescription className="text-red-600 font-medium">
                        If you're in immediate danger, call 911 or go to your nearest emergency room
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.resources.map((resource, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                            category.urgent 
                              ? 'border-red-200 bg-red-50 hover:border-red-300' 
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                            <Badge variant={category.urgent ? "destructive" : "secondary"}>
                              {resource.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono text-blue-600">{resource.contact}</span>
                            <Button 
                              size="sm" 
                              variant={category.urgent ? "destructive" : "outline"}
                              onClick={() => {
                                if (resource.contact.includes('http') || resource.contact.includes('.')) {
                                  window.open(`https://${resource.contact.replace('https://', '').replace('http://', '')}`, '_blank');
                                } else {
                                  navigator.clipboard.writeText(resource.contact);
                                  // Could add toast notification here
                                }
                              }}
                            >
                              {category.urgent ? <Phone className="h-3 w-3 mr-1" /> : <BookOpen className="h-3 w-3 mr-1" />}
                              {category.urgent ? 'Call' : 'Visit'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Recovery-Focused Habits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Recovery-Focused Daily Habits
              </CardTitle>
              <CardDescription>
                Build a strong foundation for lasting recovery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Morning Recovery Meditation",
                    description: "Start each day with intention and mindfulness",
                    time: "10 minutes",
                    difficulty: "Easy",
                    category: "Mindfulness"
                  },
                  {
                    name: "Sponsor/Accountability Check-in",
                    description: "Daily connection with your support network",
                    time: "15 minutes", 
                    difficulty: "Easy",
                    category: "Connection"
                  },
                  {
                    name: "Recovery Literature Reading",
                    description: "Daily reading from recovery books or meditations",
                    time: "20 minutes",
                    difficulty: "Easy", 
                    category: "Learning"
                  },
                  {
                    name: "Gratitude Practice",
                    description: "Focus on positive aspects of recovery and life",
                    time: "5 minutes",
                    difficulty: "Easy",
                    category: "Mindfulness"
                  },
                  {
                    name: "Physical Exercise",
                    description: "Natural endorphin boost and stress relief",
                    time: "30 minutes",
                    difficulty: "Medium",
                    category: "Physical"
                  },
                  {
                    name: "Evening Reflection",
                    description: "Review the day's challenges and victories",
                    time: "10 minutes",
                    difficulty: "Easy",
                    category: "Mindfulness"
                  }
                ].map((habit, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{habit.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {habit.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{habit.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {habit.time}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        habit.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        habit.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {habit.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Motivational Quote */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <blockquote className="text-xl font-medium mb-4">
                "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would."
              </blockquote>
              <cite className="text-blue-200">— Recovery Community Wisdom</cite>
              <div className="mt-6 flex justify-center space-x-4">
                <Button variant="secondary" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Share Your Story
                </Button>
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Users className="h-4 w-4 mr-2" />
                  Connect with Others
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}