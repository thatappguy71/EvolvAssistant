import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowLeft } from "lucide-react";

export default function DirectPayment() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);

  const handleDirectPayment = async (planType: 'monthly' | 'yearly') => {
    setLoading(true);
    setSelectedPlan(planType);
    
    try {
      console.log('Direct payment button clicked:', planType);
      
      const response = await fetch('/api/subscription/demo-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Payment failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      
      if (data.checkoutUrl) {
        console.log('Redirecting to:', data.checkoutUrl);
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Direct Payment Test</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Test the Stripe integration directly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Monthly Plan</CardTitle>
              <div className="text-4xl font-bold text-blue-600 mt-4">$4.99</div>
              <p className="text-gray-600 dark:text-gray-300">CAD per month</p>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleDirectPayment('monthly')}
                disabled={loading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {loading && selectedPlan === 'monthly' ? 'Creating Session...' : 'Pay $4.99 CAD/month'}
              </Button>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="border-2 border-blue-600 dark:border-blue-600 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Best Value
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Yearly Plan</CardTitle>
              <div className="text-4xl font-bold text-blue-600 mt-4">$49.99</div>
              <p className="text-gray-600 dark:text-gray-300">CAD per year</p>
              <p className="text-sm text-green-600">Save 16%</p>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleDirectPayment('yearly')}
                disabled={loading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {loading && selectedPlan === 'yearly' ? 'Creating Session...' : 'Pay $49.99 CAD/year'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What happens when you click?</h3>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Creates a secure Stripe checkout session</li>
            <li>2. Redirects you to Stripe's payment page</li>
            <li>3. You'll see the exact CAD pricing</li>
            <li>4. Test payment processing (don't complete unless you want to subscribe)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}