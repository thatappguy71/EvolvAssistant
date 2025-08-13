import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Sparkles, Users, Zap, Heart, TrendingUp, Gift, Crown, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface BetaSignupData {
  name: string;
  email: string;
  motivation: string;
  experience: string;
  referralSource: string;
}

export default function BetaSignup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<BetaSignupData>({
    name: "",
    email: (user as any)?.email || "",
    motivation: "",
    experience: "",
    referralSource: ""
  });

  const betaSignupMutation = useMutation({
    mutationFn: async (data: BetaSignupData) => {
      return await apiRequest("POST", "/api/beta-signup", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Beta Program!",
        description: "We'll contact you soon with exclusive access and premium features.",
      });
      setFormData({
        name: "",
        email: (user as any)?.email || "",
        motivation: "",
        experience: "",
        referralSource: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.motivation) {
      toast({
        title: "Please fill in required fields",
        description: "Name, email, and motivation are required.",
        variant: "destructive",
      });
      return;
    }
    betaSignupMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof BetaSignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-evolv-primary to-evolv-secondary py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <svg width="32" height="32" viewBox="0 0 192 192" className="text-evolv-primary">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M96 144 C96 122, 96 114, 101 105 C107 95, 120 88, 135 88" strokeWidth="6"/>
                  <path d="M135 88 L125 79 M135 88 L128 97" strokeWidth="6"/>
                  <path d="M85 114 C67 112, 58 101, 56 88 C79 86, 91 97, 85 114 Z" fill="currentColor" stroke="none"/>
                  <path d="M105 114 C123 112, 132 101, 134 88 C111 86, 99 97, 105 114 Z" fill="currentColor" stroke="none"/>
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Join the Evolv Beta Program
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Be among the first to experience the future of personal wellness tracking. 
                Get exclusive access to AI-powered recommendations and premium features.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Badge className="bg-white/20 text-white border-white/30 text-lg py-2 px-4">
              <Crown className="w-4 h-4 mr-2" />
              Free Lifetime Premium
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 text-lg py-2 px-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Early AI Access
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 text-lg py-2 px-4">
              <Users className="w-4 h-4 mr-2" />
              Exclusive Community
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Beta Signup Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gray-900 dark:text-white">
                  Apply for Beta Access
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  Help shape the future of wellness tracking while getting exclusive benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        className="mt-2 h-12"
                        data-testid="input-beta-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className="mt-2 h-12"
                        data-testid="input-beta-email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="motivation" className="text-base font-medium">
                      Why do you want to join the beta? *
                    </Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => handleInputChange("motivation", e.target.value)}
                      placeholder="Tell us about your wellness goals and what excites you about Evolv..."
                      className="mt-2 min-h-[100px]"
                      data-testid="textarea-beta-motivation"
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-base font-medium">
                      Current Wellness/Habit Tracking Experience
                    </Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="What apps have you used? What worked or didn't work for you?"
                      className="mt-2 min-h-[80px]"
                      data-testid="textarea-beta-experience"
                    />
                  </div>

                  <div>
                    <Label htmlFor="referralSource" className="text-base font-medium">
                      How did you hear about Evolv?
                    </Label>
                    <Input
                      id="referralSource"
                      value={formData.referralSource}
                      onChange={(e) => handleInputChange("referralSource", e.target.value)}
                      placeholder="Social media, friend, blog post, etc."
                      className="mt-2 h-12"
                      data-testid="input-beta-referral"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-evolv-primary to-evolv-secondary hover:from-evolv-primary/90 hover:to-evolv-secondary/90 text-white shadow-lg"
                    disabled={betaSignupMutation.isPending}
                    data-testid="button-beta-submit"
                  >
                    {betaSignupMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Star className="w-5 h-5 mr-3" />
                        Apply for Beta Access
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800 dark:text-orange-300">
                  <Gift className="w-6 h-6 mr-2" />
                  Beta Tester Perks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Lifetime Premium Access</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Worth $60/year - yours free forever</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Early AI Features</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">First access to GPT-4o recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Beta Tester Badge</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Special recognition in the app</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Direct Developer Access</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Shape features with your feedback</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800 dark:text-purple-300">
                  <Zap className="w-6 h-6 mr-2" />
                  What You'll Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Daily wellness tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">AI-powered insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Biohack library</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Social features</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 dark:text-green-300">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Beta applications received</div>
                </div>
                <div className="mt-4 bg-green-200 dark:bg-green-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Limited spots available
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Makes Evolv Different
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of wellness tracking with AI-powered insights 
              and a comprehensive approach to personal growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  AI Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized wellness suggestions powered by GPT-4o, analyzing your habits and metrics for optimal growth.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Holistic Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor energy, focus, mood, productivity, and sleep quality alongside your habits for complete wellness insights.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Smart Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Visualize your progress with interactive charts and identify patterns that drive your personal growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}