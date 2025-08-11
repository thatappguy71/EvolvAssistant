import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testPayment = async (planType: 'monthly' | 'yearly') => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing payment for:', planType);
      
      const response = await fetch('/api/subscription/demo-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planType }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setResult(`Error: ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('Success response:', data);
      
      if (data.checkoutUrl) {
        setResult(`✅ Success! Checkout URL: ${data.checkoutUrl.substring(0, 50)}...`);
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        setResult('❌ No checkout URL received');
      }
      
    } catch (error) {
      console.error('Payment test error:', error);
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Payment System Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => testPayment('monthly')} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Monthly Payment ($4.99 CAD)'}
          </Button>
          
          <Button 
            onClick={() => testPayment('yearly')} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test Yearly Payment ($49.99 CAD)'}
          </Button>
          
          {result && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm font-mono">
              {result}
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-4">
            This page tests the Stripe payment integration. Click a button to create a checkout session and redirect to Stripe.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}