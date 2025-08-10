import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Shield, Zap } from "lucide-react";
import { useSidebar } from "@/components/Sidebar";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { isCollapsed } = useSidebar();

  const features = {
    free: [
      "Track up to 15 habits",
      "Complete wellness metrics tracking", 
      "All biohack information & tools",
      "Basic AI recommendations (2-3/week)",
      "7-day habit streak tracking",
      "Interactive biohack tools",
      "Voice-guided exercises",
      "Export your data anytime",
      "No ads, clean experience"
    ],
    premium: [
      "Unlimited habits",
      "Advanced AI recommendations (daily)",
      "Detailed analytics & correlations",
      "Health app integrations",
      "Custom habit categories",
      "Premium biohack frequencies",
      "Priority customer support",
      "Family sharing (up to 6 users)",
      "Early access to new features"
    ]
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 ${
      isCollapsed ? 'pl-16' : 'pl-64'
    }`}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            <Shield className="w-4 h-4 mr-2" />
            No Hidden Fees, No Surprises
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unlike other apps, we believe in honest pricing. No billing surprises, 
            cancel anytime with one click, and keep your data forever.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="w-5 h-5 text-emerald-500" />
            One-Click Cancel
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Star className="w-5 h-5 text-emerald-500" />
            30-Day Refund
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Zap className="w-5 h-5 text-emerald-500" />
            24hr Support
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border">
            <Button
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingPeriod('monthly')}
              className="mx-1"
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
              onClick={() => setBillingPeriod('yearly')}
              className="mx-1"
            >
              Yearly
              <Badge className="ml-2 bg-emerald-500 text-white text-xs">33% OFF</Badge>
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Free Plan */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Free Forever</CardTitle>
                  <CardDescription className="mt-2">
                    Everything you need to start building better habits
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Most Popular
                </Badge>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-500 dark:text-gray-400">/forever</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-6 bg-emerald-600 hover:bg-emerald-700">
                Get Started Free
              </Button>
              <ul className="space-y-3">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-emerald-500 shadow-xl relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-500 text-white px-6 py-1">
                Best Value
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription className="mt-2">
                Advanced features for serious habit builders
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${billingPeriod === 'monthly' ? '4.99' : '3.33'}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  /{billingPeriod === 'monthly' ? 'month' : 'month'}
                </span>
                {billingPeriod === 'yearly' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Billed yearly at $39.99 (save $20)
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-6 bg-emerald-600 hover:bg-emerald-700">
                Start Premium Trial
              </Button>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Everything in Free, plus:
                  </span>
                </li>
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Student Discount */}
        <div className="text-center mb-12">
          <Card className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Student Discount</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                50% off Premium with valid student email
              </p>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300">
                Verify Student Status
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Comparison with Competitors */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Evolv?</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-2">Feature</th>
                      <th className="text-center py-4 px-2">
                        <div className="font-bold text-emerald-600">Evolv</div>
                        <div className="text-sm text-gray-500">Transparent</div>
                      </th>
                      <th className="text-center py-4 px-2">
                        <div className="font-bold text-gray-500">Others</div>
                        <div className="text-sm text-gray-500">Hidden costs</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-2">Free habit tracking</td>
                      <td className="text-center py-3 px-2">
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        <div className="text-xs text-gray-600">15 habits</div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                        <div className="text-xs text-gray-600">Very limited</div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2">Transparent pricing</td>
                      <td className="text-center py-3 px-2">
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        <div className="text-xs text-gray-600">Always visible</div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                        <div className="text-xs text-gray-600">Hidden fees</div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2">One-click cancellation</td>
                      <td className="text-center py-3 px-2">
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        <div className="text-xs text-gray-600">In-app</div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                        <div className="text-xs text-gray-600">Email only</div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2">Customer support</td>
                      <td className="text-center py-3 px-2">
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        <div className="text-xs text-gray-600">24 hours</div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                        <div className="text-xs text-gray-600">Weeks/months</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2">Data export</td>
                      <td className="text-center py-3 px-2">
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        <div className="text-xs text-gray-600">Always free</div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                        <div className="text-xs text-gray-600">Often locked</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-2">Can I really cancel anytime?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! Unlike other apps, you can cancel with one click directly in the app or website. 
                  No need to email support or wait for responses.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-2">What happens to my data if I cancel?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You keep all your data forever. You can export everything anytime, and your free 
                  account continues working with up to 15 habits.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-2">Are there any hidden fees?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Never. What you see is what you pay. No surprise charges, no setup fees, 
                  no cancellation fees. We believe in honest pricing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}