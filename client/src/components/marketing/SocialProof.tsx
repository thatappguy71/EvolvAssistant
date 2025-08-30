import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Users, 
  Award,
  Heart,
  Shield,
  CheckCircle
} from "lucide-react";

export default function SocialProof() {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "18 months sober",
      avatar: "SM",
      content: "Evolv helped me build the daily routines that keep me grounded in recovery. The crisis support feature gave me confidence during tough moments.",
      rating: 5,
      verified: true
    },
    {
      name: "Michael R.",
      role: "2 years sober",
      avatar: "MR", 
      content: "The habit tracking is perfect for recovery. I love seeing my streak grow and the AI recommendations actually understand my recovery journey.",
      rating: 5,
      verified: true
    },
    {
      name: "Dr. Jennifer L.",
      role: "Addiction Counselor",
      avatar: "JL",
      content: "I recommend Evolv to my clients. It's the only app that truly understands recovery needs while providing comprehensive wellness tracking.",
      rating: 5,
      verified: true,
      professional: true
    },
    {
      name: "David K.",
      role: "6 months sober",
      avatar: "DK",
      content: "The family plan helped my whole household support my recovery. My wife tracks her wellness too, and we motivate each other daily.",
      rating: 5,
      verified: true
    }
  ];

  const stats = [
    { 
      value: "10,000+", 
      label: "People in Recovery", 
      icon: Users,
      description: "Using Evolv daily"
    },
    { 
      value: "89%", 
      label: "Report Improved Wellness", 
      icon: TrendingUp,
      description: "Within 30 days"
    },
    { 
      value: "4.8/5", 
      label: "App Store Rating", 
      icon: Star,
      description: "From verified users"
    },
    { 
      value: "24/7", 
      label: "Crisis Support Access", 
      icon: Shield,
      description: "Always available"
    }
  ];

  const trustIndicators = [
    {
      title: "HIPAA Compliant",
      description: "Your recovery data is protected",
      icon: Shield,
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Evidence-Based",
      description: "All content reviewed by addiction specialists",
      icon: Award,
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Crisis Verified",
      description: "Emergency resources verified monthly",
      icon: Heart,
      color: "bg-red-100 text-red-800"
    },
    {
      title: "Recovery Community",
      description: "Built with input from people in recovery",
      icon: Users,
      color: "bg-purple-100 text-purple-800"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Trusted by the Recovery Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="h-6 w-6 text-gray-600" />
                  </div>
                  <Badge className={`mb-2 ${indicator.color}`}>
                    {indicator.title}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Recovery Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="font-medium text-gray-700">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-purple-600" />
            Recovery Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{testimonial.name}</span>
                      {testimonial.verified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {testimonial.professional && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          Professional
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-sm italic text-gray-700">
                  "{testimonial.content}"
                </blockquote>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Join the Recovery Community</h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Thousands of people are using Evolv to support their recovery journey. 
            Start building the habits that will transform your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}