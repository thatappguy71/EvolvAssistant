import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SocialProof from "@/components/marketing/SocialProof";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-evolv-primary/10 via-white dark:via-gray-900 to-evolv-secondary/10">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-evolv-secondary to-evolv-success rounded-xl flex items-center justify-center shadow-lg">
              <svg width="32" height="32" viewBox="0 0 192 192" className="text-white">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M96 144 C96 122, 96 114, 101 105 C107 95, 120 88, 135 88" strokeWidth="6"/>
                  <path d="M135 88 L125 79 M135 88 L128 97" strokeWidth="6"/>
                  <path d="M85 114 C67 112, 58 101, 56 88 C79 86, 91 97, 85 114 Z" fill="currentColor" stroke="none"/>
                  <path d="M105 114 C123 112, 132 101, 134 88 C111 86, 99 97, 105 114 Z" fill="currentColor" stroke="none"/>
                  <path d="M68 148 Q96 158 125 148" strokeWidth="4" opacity="0.9"/>
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Evolv</h1>
              <p className="text-gray-600 dark:text-gray-300">Recovery-Focused Wellness & Habit Tracker</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support your recovery journey with intelligent habit tracking, wellness monitoring, and evidence-based recovery tools designed for lasting sobriety.
          </p>
        </header>

        {/* Color Demo Link */}
        <div className="text-center mb-8">
          <a 
            href="/color-demo" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            🎨 See Scientific Color Psychology in Action
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 hover:border-evolv-primary/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-evolv-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recovery-Safe Tracking</h3>
              <p className="text-gray-600">Build recovery habits with intelligent tracking designed specifically for addiction recovery and sobriety maintenance.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-secondary/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-phone text-evolv-secondary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Crisis Support</h3>
              <p className="text-gray-600">Immediate access to crisis helplines, sponsor contacts, and emergency resources when you need them most.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-accent/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-evolv-accent text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recovery Community</h3>
              <p className="text-gray-600">Connect with support groups, find meetings, and access recovery resources tailored to your location.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-accent/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-evolv-accent text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recovery Analytics</h3>
              <p className="text-gray-600">Track your sobriety progress, wellness improvements, and recovery milestones with detailed insights.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-secondary/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-evolv-secondary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Recovery Insights</h3>
              <p className="text-gray-600">Get personalized recovery recommendations based on your progress, triggers, and wellness patterns.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-premium/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-premium/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-evolv-premium text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Privacy & Security</h3>
              <p className="text-gray-600">Your recovery data is completely private and secure, with full control over what you share.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <SocialProof />
        
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Recovery?</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of people in recovery who are building stronger, healthier lives with Evolv.
              </p>
              <Button 
                size="lg" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0 px-6 py-3"
                onClick={() => window.location.href = '/api/login'}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Start Your Recovery Journey
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                <i className="fas fa-lock mr-1 text-evolv-primary"></i>
                100% Private & Secure • Trusted by Recovery Professionals
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
}
