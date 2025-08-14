import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Image, 
  Video,
  Calendar,
  Target,
  Users,
  TrendingUp,
  Mail,
  Share2,
  Smartphone,
  Monitor,
  MessageSquare,
  BarChart3
} from "lucide-react";

export default function MarketingResources() {
  const marketingAssets = [
    {
      category: "Brand Assets",
      items: [
        { name: "Logo Package", type: "ZIP", size: "2.3 MB", status: "ready" },
        { name: "Brand Guidelines", type: "PDF", size: "1.8 MB", status: "ready" },
        { name: "Color Palette", type: "AI", size: "0.5 MB", status: "ready" },
        { name: "Typography Guide", type: "PDF", size: "1.2 MB", status: "ready" }
      ]
    },
    {
      category: "Social Media",
      items: [
        { name: "Instagram Templates", type: "PSD", size: "15.2 MB", status: "ready" },
        { name: "TikTok Templates", type: "MP4", size: "25.8 MB", status: "ready" },
        { name: "LinkedIn Templates", type: "PSD", size: "8.3 MB", status: "ready" },
        { name: "Story Templates", type: "PSD", size: "12.1 MB", status: "ready" }
      ]
    },
    {
      category: "Content",
      items: [
        { name: "Blog Post Templates", type: "DOC", size: "0.8 MB", status: "ready" },
        { name: "Email Templates", type: "HTML", size: "1.2 MB", status: "ready" },
        { name: "Video Scripts", type: "PDF", size: "0.6 MB", status: "ready" },
        { name: "Hashtag Research", type: "XLS", size: "0.3 MB", status: "ready" }
      ]
    },
    {
      category: "Advertising",
      items: [
        { name: "Google Ads Creative", type: "ZIP", size: "18.5 MB", status: "ready" },
        { name: "Facebook Ad Templates", type: "PSD", size: "22.1 MB", status: "ready" },
        { name: "App Store Screenshots", type: "PNG", size: "8.7 MB", status: "ready" },
        { name: "Video Ad Assets", type: "MP4", size: "45.2 MB", status: "ready" }
      ]
    }
  ];

  const campaignTemplates = [
    {
      name: "30-Day Habit Challenge",
      description: "Complete campaign package for social media habit challenge",
      platforms: ["Instagram", "TikTok", "Facebook"],
      duration: "30 days",
      assets: 25,
      status: "ready"
    },
    {
      name: "Beta Launch Campaign",
      description: "Multi-platform launch strategy with announcement templates",
      platforms: ["All Platforms", "Email", "PR"],
      duration: "2 weeks",
      assets: 18,
      status: "ready"
    },
    {
      name: "Family Plan Promotion",
      description: "Targeted campaign highlighting unique family features",
      platforms: ["LinkedIn", "Facebook", "Email"],
      duration: "4 weeks",
      assets: 15,
      status: "ready"
    },
    {
      name: "Holiday Wellness",
      description: "Seasonal campaign for New Year wellness resolutions",
      platforms: ["Instagram", "TikTok", "YouTube"],
      duration: "6 weeks",
      assets: 30,
      status: "planned"
    }
  ];

  const contentCalendar = [
    {
      week: "Week 1",
      theme: "Introduction & Value Proposition",
      posts: 12,
      platforms: ["Instagram", "TikTok", "LinkedIn", "Facebook"],
      status: "scheduled"
    },
    {
      week: "Week 2", 
      theme: "Educational Content - Habit Science",
      posts: 10,
      platforms: ["Instagram", "TikTok", "Facebook"],
      status: "scheduled"
    },
    {
      week: "Week 3",
      theme: "Community Building & User Stories",
      posts: 14,
      platforms: ["Instagram", "TikTok", "LinkedIn", "Facebook"],
      status: "draft"
    },
    {
      week: "Week 4",
      theme: "Product Demo & Features",
      posts: 11,
      platforms: ["Instagram", "TikTok", "Facebook"],
      status: "planning"
    }
  ];

  const influencerKit = [
    {
      name: "Influencer Brief Template",
      description: "Complete brief template for influencer partnerships",
      type: "PDF"
    },
    {
      name: "Content Guidelines",
      description: "Brand guidelines and content requirements for influencers",
      type: "PDF"
    },
    {
      name: "Media Kit",
      description: "Professional media kit for influencer outreach",
      type: "PDF"
    },
    {
      name: "Contract Templates",
      description: "Legal templates for influencer agreements",
      type: "DOC"
    }
  ];

  const analyticsTemplates = [
    {
      name: "Social Media Report",
      description: "Weekly performance tracking template",
      metrics: ["Engagement", "Reach", "Conversion"],
      type: "Excel"
    },
    {
      name: "Campaign Performance",
      description: "Comprehensive campaign analysis template",
      metrics: ["ROI", "CAC", "LTV"],
      type: "Excel"
    },
    {
      name: "Influencer Tracking",
      description: "Influencer partnership performance metrics",
      metrics: ["Reach", "Engagement", "Conversions"],
      type: "Excel"
    },
    {
      name: "Competitor Analysis",
      description: "Monthly competitor tracking template",
      metrics: ["Share of Voice", "Engagement", "Growth"],
      type: "Excel"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Download className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">Marketing Resources</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Complete collection of marketing assets, templates, and tools for Evolv's growth strategy
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="h-20 flex-col space-y-2">
          <Download className="h-6 w-6" />
          <span>Download All Assets</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Calendar className="h-6 w-6" />
          <span>Content Calendar</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <BarChart3 className="h-6 w-6" />
          <span>Analytics Dashboard</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Users className="h-6 w-6" />
          <span>Influencer Kit</span>
        </Button>
      </div>

      {/* Marketing Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-green-600" />
            Marketing Assets
          </CardTitle>
          <CardDescription>
            Ready-to-use brand assets, templates, and creative materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {marketingAssets.map((category, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">{category.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{item.size}</div>
                      <Button size="sm" className="w-full">
                        <Download className="h-3 w-3 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Campaign Templates
          </CardTitle>
          <CardDescription>
            Pre-built campaign packages with all assets and strategies included
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaignTemplates.map((campaign, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{campaign.name}</h3>
                  <Badge variant={campaign.status === 'ready' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{campaign.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Assets:</span>
                    <span className="font-medium">{campaign.assets} items</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map((platform, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
                
                <Button className="w-full" disabled={campaign.status !== 'ready'}>
                  <Download className="h-4 w-4 mr-2" />
                  {campaign.status === 'ready' ? 'Download Campaign' : 'Coming Soon'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Content Calendar
          </CardTitle>
          <CardDescription>
            Pre-planned content schedule for the first month of marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentCalendar.map((week, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{week.week}</h3>
                    <p className="text-sm text-muted-foreground">{week.theme}</p>
                  </div>
                  <Badge variant={
                    week.status === 'scheduled' ? 'default' :
                    week.status === 'draft' ? 'secondary' : 'outline'
                  }>
                    {week.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Posts: </span>
                      <span className="font-medium">{week.posts}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {week.platforms.map((platform, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Influencer Kit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Influencer Kit
            </CardTitle>
            <CardDescription>
              Everything needed for successful influencer partnerships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {influencerKit.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.type}</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Analytics Templates
            </CardTitle>
            <CardDescription>
              Tracking templates for measuring marketing performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsTemplates.map((template, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{template.name}</div>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{template.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {template.metrics.map((metric, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full">
                    <Download className="h-3 w-3 mr-2" />
                    Download Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-green-600" />
            Recommended Marketing Tools
          </CardTitle>
          <CardDescription>
            External tools and platforms to amplify your marketing efforts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Canva Pro", category: "Design", price: "$15/month", purpose: "Social media graphics" },
              { name: "Later", category: "Scheduling", price: "$25/month", purpose: "Multi-platform posting" },
              { name: "Sprout Social", category: "Analytics", price: "$249/month", purpose: "Performance tracking" },
              { name: "Grin", category: "Influencer", price: "$1,200/month", purpose: "Influencer management" },
              { name: "Mention", category: "Monitoring", price: "$99/month", purpose: "Brand monitoring" },
              { name: "Mailchimp", category: "Email", price: "$20/month", purpose: "Email marketing" }
            ].map((tool, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div>
                  <div className="font-semibold">{tool.name}</div>
                  <div className="text-sm text-muted-foreground">{tool.purpose}</div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{tool.category}</Badge>
                  <span className="text-sm font-medium">{tool.price}</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}