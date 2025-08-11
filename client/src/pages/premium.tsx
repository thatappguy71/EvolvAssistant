import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CheckCircle, CreditCard, Shield } from "lucide-react";

export default function Premium() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isCollapsed } = useSidebar();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);

  const upgradeMutation = useMutation({
    mutationFn: async (planType: 'monthly' | 'yearly') => {
      const response = await fetch('/api/subscription/demo-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planType }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout error:', errorText);
        throw new Error('Failed to create checkout session');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        // Redirect to payment processor
        window.location.href = data.checkoutUrl;
      } else {
        // Mock upgrade success for demo
        toast({
          title: "Upgrade successful!",
          description: "Welcome to Evolv Premium! Your account has been upgraded.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      }
    },
    onError: (error: any) => {
      console.error('Payment error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast({
        title: "Upgrade failed",
        description: error.message || "Unable to process upgrade. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = (planType: 'monthly' | 'yearly') => {
    console.log('Upgrade button clicked:', planType);
    console.log('User:', user);
    console.log('Auth status:', !!user);
    setSelectedPlan(planType);
    upgradeMutation.mutate(planType);
  };

  const premiumFeatures = [
    "Unlimited habits",
    "Advanced ML-powered AI insights",
    "Complete biohack library (300+)",
    "Health Connect integration",
    "90-day detailed analytics",
    "Smart notifications",
    "Cloud sync & backup",
    "Advanced progress tracking",
    "Custom habit categories",
    "Priority support"
  ];

  // Show success message if already premium
  if (user?.subscriptionTier === 'PREMIUM') {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
        <Sidebar />
        
        <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
          <DashboardHeader />
          
          <div className="p-4 md:p-8 pt-20 md:pt-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">You're already Premium!</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Thank you for being an Evolv Premium member. You have access to all our premium features.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 pt-20 md:pt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Evolv Premium</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Unlock the full potential of your wellness journey</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Monthly Plan */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">Evolv Pro Monthly</CardTitle>
                  <div className="text-4xl font-bold text-primary mt-4">$4.99</div>
                  <p className="text-gray-600 dark:text-gray-300">CAD per month</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Perfect for serious biohackers</p>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full mb-6 bg-primary hover:bg-blue-700"
                    onClick={() => handleUpgrade('monthly')}
                    disabled={upgradeMutation.isPending}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {upgradeMutation.isPending && selectedPlan === 'monthly' ? 'Processing...' : 'Start Monthly Plan'}
                  </Button>
                  <ul className="space-y-3">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <i className="fas fa-check text-secondary mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Yearly Plan */}
              <Card className="border-2 border-primary dark:border-primary relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">Evolv Pro Yearly</CardTitle>
                  <div className="text-4xl font-bold text-primary mt-4">$49.99</div>
                  <p className="text-gray-600 dark:text-gray-300">CAD per year</p>
                  <div className="flex items-center justify-center mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mr-2">Best value for committed optimizers</p>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      Save 16%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full mb-6 bg-primary hover:bg-blue-700"
                    onClick={() => handleUpgrade('yearly')}
                    disabled={upgradeMutation.isPending}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {upgradeMutation.isPending && selectedPlan === 'yearly' ? 'Processing...' : 'Start Yearly Plan'}
                  </Button>
                  <ul className="space-y-3">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <i className="fas fa-check text-secondary mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Feature Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-gray-900 dark:text-white">Why Choose Premium?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-brain text-primary text-2xl"></i>
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">AI-Powered Insights</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get personalized recommendations based on your habits and wellness data</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-infinity text-secondary text-2xl"></i>
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Unlimited Everything</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">No limits on habits, biohacks, or data storage</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-chart-line text-accent text-2xl"></i>
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Advanced Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Deep insights with 90-day trends and predictive analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
