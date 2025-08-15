import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  BarChart3, 
  Megaphone,
  Calendar,
  Mail,
  Share2,
  Star,
  Heart,
  Award,
  Zap,
  Globe,
  Smartphone,
  LineChart
} from "lucide-react";

export default function Marketing() {
  const marketingChannels = [
    {
      name: "Organic Social Media",
      budget: "$0",
      reach: "5,000+",
      conversion: "4.2%",
      status: "active",
      platforms: ["Instagram", "TikTok", "LinkedIn"]
    },
    {
      name: "Content Marketing",
      budget: "$500/mo",
      reach: "2,500+",
      conversion: "6.8%",
      status: "planning",
      platforms: ["Blog", "YouTube", "Podcasts"]
    },
    {
      name: "Paid Advertising",
      budget: "$800/mo",
      reach: "15,000+",
      conversion: "3.1%",
      status: "ready",
      platforms: ["Google Ads", "Facebook", "App Store"]
    },
    {
      name: "Email Marketing",
      budget: "$50/mo",
      reach: "1,200+",
      conversion: "12.5%",
      status: "active",
      platforms: ["Newsletter", "Automation", "Sequences"]
    }
  ];

  const campaignIdeas = [
    {
      title: "30-Day Habit Challenge",
      description: "Community-driven habit formation challenge with daily check-ins",
      target: "Health-conscious millennials",
      timeline: "4 weeks",
      budget: "$200",
      expectedReach: "10,000+"
    },
    {
      title: "Corporate Wellness Pilot",
      description: "Free family plan trials for Canadian companies",
      target: "HR managers, wellness coordinators",
      timeline: "8 weeks",
      budget: "$500",
      expectedReach: "50 companies"
    },
    {
      title: "AI Wellness Insights Demo",
      description: "Showcase personalized recommendations and biohacking features",
      target: "Wellness enthusiasts, biohackers",
      timeline: "6 weeks",
      budget: "$300",
      expectedReach: "5,000+"
    },
    {
      title: "New Year Transformation",
      description: "Leverage resolution season with free premium trials",
      target: "General wellness audience",
      timeline: "12 weeks",
      budget: "$1,000",
      expectedReach: "25,000+"
    }
  ];

  const competitiveAdvantages = [
    {
      advantage: "15 Free Habits",
      competitor: "Competitors: 3-5 habits",
      impact: "300% more value in free tier"
    },
    {
      advantage: "$4.99 CAD Pricing",
      competitor: "US apps: $6.99+ USD",
      impact: "25% cheaper for Canadians"
    },
    {
      advantage: "Family Plan ($69.99)",
      competitor: "Most apps: Individual only",
      impact: "Unique market position"
    },
    {
      advantage: "AI Recommendations",
      competitor: "Static tracking apps",
      impact: "Personalized experience"
    }
  ];

  const marketMetrics = [
    { label: "Global Market Size", value: "$11.42B", growth: "+14.4% CAGR" },
    { label: "Canadian Market", value: "$441M", growth: "+5.5% annually" },
    { label: "User Preference", value: "61%", growth: "prioritize habits" },
    { label: "Mobile Adoption", value: "65%", growth: "daily tracking" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Megaphone className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">Marketing Strategy</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive marketing strategy for Evolv's beta launch and market penetration
        </p>
      </div>

      {/* Market Opportunity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Market Opportunity
          </CardTitle>
          <CardDescription>
            Wellness app market growth and positioning analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metric.value}</div>
                <div className="text-sm font-medium">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.growth}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Advantages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Competitive Advantages
          </CardTitle>
          <CardDescription>
            Key differentiators that set Evolv apart from competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitiveAdvantages.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-green-600 text-sm sm:text-base">{item.advantage}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{item.competitor}</div>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="secondary" className="text-xs px-2 py-1 max-w-[140px] text-center leading-tight">
                    {item.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Marketing Channels
          </CardTitle>
          <CardDescription>
            Multi-channel approach with budget allocation and performance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketingChannels.map((channel, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{channel.name}</h3>
                  <Badge 
                    variant={channel.status === 'active' ? 'default' : 
                           channel.status === 'ready' ? 'secondary' : 'outline'}
                  >
                    {channel.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-medium">{channel.budget}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Reach</div>
                    <div className="font-medium">{channel.reach}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversion</div>
                    <div className="font-medium">{channel.conversion}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {channel.platforms.map((platform, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Ideas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            Campaign Ideas
          </CardTitle>
          <CardDescription>
            Strategic campaigns designed for maximum impact and user acquisition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaignIdeas.map((campaign, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{campaign.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {campaign.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-medium">{campaign.target}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timeline:</span>
                    <span className="font-medium">{campaign.timeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium">{campaign.budget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected Reach:</span>
                    <span className="font-medium text-green-600">{campaign.expectedReach}</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" size="sm">
                  Plan Campaign
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Marketing Timeline
          </CardTitle>
          <CardDescription>
            Strategic rollout plan for the next 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                phase: "Pre-Launch (Months 1-2)",
                activities: ["Beta signup optimization", "Content creation", "Influencer outreach", "Paid ad testing"],
                progress: 75
              },
              {
                phase: "Launch (Month 3)",
                activities: ["Press release", "Influencer campaigns", "Paid advertising scale-up", "Launch events"],
                progress: 25
              },
              {
                phase: "Growth (Months 4-6)",
                activities: ["A/B testing", "User-generated content", "Partnerships", "Corporate pilots"],
                progress: 0
              }
            ].map((phase, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{phase.phase}</h3>
                  <span className="text-sm text-muted-foreground">{phase.progress}% Complete</span>
                </div>
                <Progress value={phase.progress} className="h-2" />
                <div className="flex flex-wrap gap-2">
                  {phase.activities.map((activity, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Budget Allocation
          </CardTitle>
          <CardDescription>
            Monthly marketing budget distribution: $2,000 CAD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: "Paid Advertising", amount: "$800", percentage: 40, color: "bg-green-600" },
              { category: "Content Marketing", amount: "$500", percentage: 25, color: "bg-blue-600" },
              { category: "Influencer Marketing", amount: "$400", percentage: 20, color: "bg-purple-600" },
              { category: "Tools & Software", amount: "$200", percentage: 10, color: "bg-orange-600" },
              { category: "Events & PR", amount: "$100", percentage: 5, color: "bg-pink-600" }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm font-semibold">{item.amount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground">{item.percentage}% of total budget</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Next Steps
          </CardTitle>
          <CardDescription>
            Immediate actions to implement the marketing strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Set Up Analytics",
                description: "Configure tracking for all marketing channels",
                priority: "High",
                timeline: "Week 1"
              },
              {
                title: "Create Content Calendar",
                description: "Plan 3 months of social media and blog content",
                priority: "High", 
                timeline: "Week 1-2"
              },
              {
                title: "Launch Social Accounts",
                description: "Set up Instagram, TikTok, and LinkedIn profiles",
                priority: "Medium",
                timeline: "Week 2"
              },
              {
                title: "Design Marketing Materials",
                description: "Create ads, banners, and promotional graphics",
                priority: "Medium",
                timeline: "Week 2-3"
              },
              {
                title: "Influencer Outreach",
                description: "Identify and contact wellness influencers",
                priority: "Medium",
                timeline: "Week 3-4"
              },
              {
                title: "Ad Campaign Setup",
                description: "Configure Google Ads and social media campaigns",
                priority: "Low",
                timeline: "Week 4"
              }
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{item.title}</h3>
                  <Badge variant={
                    item.priority === 'High' ? 'destructive' :
                    item.priority === 'Medium' ? 'default' : 'secondary'
                  }>
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="text-xs text-muted-foreground">{item.timeline}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}