import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Premium() {
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

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <DashboardHeader />
        
        <div className="p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Evolv Premium</h1>
            <p className="text-xl text-gray-600">Unlock the full potential of your wellness journey</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Monthly Plan */}
              <Card className="border-2 border-gray-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Evolv Pro Monthly</CardTitle>
                  <div className="text-4xl font-bold text-primary mt-4">$9.99</div>
                  <p className="text-gray-600">per month</p>
                  <p className="text-sm text-gray-500 mt-2">Perfect for serious biohackers</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6 bg-primary hover:bg-blue-700">
                    Start Monthly Plan
                  </Button>
                  <ul className="space-y-3">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <i className="fas fa-check text-secondary mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Yearly Plan */}
              <Card className="border-2 border-primary relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Evolv Pro Yearly</CardTitle>
                  <div className="text-4xl font-bold text-primary mt-4">$79.99</div>
                  <p className="text-gray-600">per year</p>
                  <div className="flex items-center justify-center mt-2">
                    <p className="text-sm text-gray-500 mr-2">Best value for committed optimizers</p>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      Save 33%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6 bg-primary hover:bg-blue-700">
                    Start Yearly Plan
                  </Button>
                  <ul className="space-y-3">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
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
                <CardTitle className="text-center">Why Choose Premium?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-brain text-primary text-2xl"></i>
                    </div>
                    <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
                    <p className="text-sm text-gray-600">Get personalized recommendations based on your habits and wellness data</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-infinity text-secondary text-2xl"></i>
                    </div>
                    <h3 className="font-semibold mb-2">Unlimited Everything</h3>
                    <p className="text-sm text-gray-600">No limits on habits, biohacks, or data storage</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-chart-line text-accent text-2xl"></i>
                    </div>
                    <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                    <p className="text-sm text-gray-600">Deep insights with 90-day trends and predictive analysis</p>
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
