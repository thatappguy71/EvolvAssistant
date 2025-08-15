import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Target,
  Brain,
  Shield,
  Award,
  Zap,
  BarChart3,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react";

export default function RecoveryPitch() {
  const valueProposition = [
    {
      icon: Heart,
      title: "Evidence-Based Habit Formation",
      description: "Scientifically-backed approach to building recovery habits with streak tracking and milestone celebrations",
      impact: "40% increase in treatment retention"
    },
    {
      icon: Brain,
      title: "AI-Powered Personalization",
      description: "GPT-4o integration provides personalized wellness strategies and adaptive suggestions",
      impact: "Personalized daily content"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Wellness Tracking",
      description: "Sleep, mood, energy, focus monitoring provides early relapse warning indicators",
      impact: "24/7 digital support"
    },
    {
      icon: DollarSign,
      title: "Cost-Effective Solution",
      description: "$4.99 CAD monthly with 15 free habits - 25% cheaper than US competitors",
      impact: "300% more free value"
    }
  ];

  const partnershipModels = [
    {
      name: "Clinical Integration",
      description: "Direct integration with CAMH, CATC treatment programs",
      revenue: "20-30% revenue share",
      features: ["White-label version", "PIPEDA compliance", "Therapist dashboard", "Provincial EHR integration"]
    },
    {
      name: "Referral Partnership", 
      description: "ConnexOntario and regional health authorities",
      revenue: "15-25% revenue share",
      features: ["Branded referral codes", "Provincial progress reports", "Co-branded materials", "Staff training"]
    },
    {
      name: "Volume Licensing",
      description: "Bulk licenses for Canadian treatment centers",
      revenue: "$3.99 CAD per client",
      features: ["Administrative portal", "Health Canada compliance", "Custom reporting", "Bilingual support"]
    }
  ];

  const competitiveAdvantages = [
    "PIPEDA compliant vs. US-only privacy standards",
    "Canadian pricing in CAD vs. expensive USD conversion", 
    "Family plan supporting household recovery (unique in Canada)",
    "Health Canada digital health framework ready",
    "Superior free tier (15 vs. 3-5 habits at CAMH/CATC)",
    "No prescription required unlike regulated digital therapeutics"
  ];

  const successMetrics = [
    { metric: "Client Retention", improvement: "15-25% increase" },
    { metric: "Treatment Completion", improvement: "10-20% improvement" },
    { metric: "Client Satisfaction", improvement: "95.6% success rate" },
    { metric: "Revenue (CAD)", improvement: "$2K-$10K monthly" },
    { metric: "SUAP Compliance", improvement: "100% reporting" }
  ];

  const pilotProgram = {
    duration: "3 months",
    investment: "Free implementation and support",
    participants: "50-100 clients per organization",
    benefits: [
      "Free Premium Access for all pilot clients",
      "Dedicated implementation support", 
      "Custom training for staff",
      "Weekly check-ins and feedback",
      "Detailed outcome reporting"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Evolv Recovery Partnership
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive wellness platform designed to enhance recovery outcomes through evidence-based habit formation and AI-powered personalization
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              $46B Canadian Impact
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              <Users className="h-3 w-3 mr-1" />
              PIPEDA Compliant
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Award className="h-3 w-3 mr-1" />
              Health Canada Ready
            </Badge>
          </div>
        </div>

        {/* Market Opportunity */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Canadian Recovery Market Opportunity
            </CardTitle>
            <CardDescription>
              Addiction treatment in Canada with significant government investment and digital health growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">6M</div>
                <div className="text-sm font-medium">Canadians Affected</div>
                <div className="text-xs text-muted-foreground">21% lifetime addiction</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">$46B</div>
                <div className="text-sm font-medium">Annual Cost</div>
                <div className="text-xs text-muted-foreground">Substance use impact</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">$500M</div>
                <div className="text-sm font-medium">Youth Mental Health</div>
                <div className="text-xs text-muted-foreground">Health Canada 2024</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">95.6%</div>
                <div className="text-sm font-medium">Success Rate</div>
                <div className="text-xs text-muted-foreground">Canadian programs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value Proposition */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Evolv's Recovery Value Proposition
            </CardTitle>
            <CardDescription>
              Comprehensive wellness platform designed specifically for recovery organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {valueProposition.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                        {item.impact}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Partnership Models */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Partnership Models
            </CardTitle>
            <CardDescription>
              Flexible partnership options designed for organizations of all sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {partnershipModels.map((model, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-green-600">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                    <div className="text-2xl font-bold">{model.revenue}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Features:</div>
                    <div className="space-y-1">
                      {model.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competitive Advantages */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Competitive Advantages
            </CardTitle>
            <CardDescription>
              Key differentiators that set Evolv apart in the recovery technology space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {competitiveAdvantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{advantage}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Expected Success Metrics
            </CardTitle>
            <CardDescription>
              Measurable improvements organizations can expect from partnership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {successMetrics.map((metric, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">{metric.improvement}</div>
                  <div className="text-sm font-medium">{metric.metric}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pilot Program */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Risk-Free Pilot Program
            </CardTitle>
            <CardDescription>
              3-month pilot to demonstrate value before long-term commitment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{pilotProgram.duration}</div>
                    <div className="text-sm font-medium text-gray-700">Duration</div>
                  </div>
                  <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">$0</div>
                    <div className="text-sm font-medium text-gray-700">Investment</div>
                  </div>
                </div>
                <div className="text-center p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-green-600">{pilotProgram.participants}</div>
                  <div className="text-sm font-medium text-gray-700">Clients per Organization</div>
                </div>
              </div>
              <div className="space-y-4 bg-white p-4 rounded-lg border shadow-sm">
                <h4 className="font-semibold text-gray-900 text-base">Pilot Benefits:</h4>
                <div className="space-y-3">
                  {pilotProgram.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-sm text-gray-900 leading-relaxed font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-green-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Ready to Enhance Your Recovery Programs?</h2>
              <p className="text-green-100 max-w-2xl mx-auto">
                Join leading treatment centers in leveraging evidence-based technology to improve client outcomes and generate additional revenue.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" variant="secondary" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Schedule Discovery Call
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-green-600">
                <Mail className="h-4 w-4" />
                Request Pilot Program
              </Button>
            </div>
            
            <div className="text-sm text-green-100">
              <p>Contact us to discuss how Evolv can enhance your Canadian recovery programs</p>
              <p className="font-medium">partnerships@evolv.ca • 1-800-EVOLV-CA</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}