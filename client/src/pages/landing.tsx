import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
              <p className="text-gray-600 dark:text-gray-300">Personal Wellness & Habit Tracker</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your life with intelligent habit tracking, wellness monitoring, and personalized biohacking insights.
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
                <i className="fas fa-check-circle text-evolv-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Habit Tracking</h3>
              <p className="text-gray-600">Build lasting habits with intelligent tracking, streaks, and personalized insights.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-secondary/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-evolv-secondary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Wellness Metrics</h3>
              <p className="text-gray-600">Monitor energy, focus, mood, and sleep quality with comprehensive analytics.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-accent/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lightbulb text-evolv-accent text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Biohack Discovery</h3>
              <p className="text-gray-600">Explore scientifically-backed biohacks to optimize your health and performance.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-accent/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-evolv-accent text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Visualize your progress with detailed charts and trend analysis.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-secondary/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-sync text-evolv-secondary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Cloud Sync</h3>
              <p className="text-gray-600">Access your data anywhere with secure cloud synchronization.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-evolv-premium/30 transition-colors hover-lift">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-evolv-premium/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-crown text-evolv-premium text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Features</h3>
              <p className="text-gray-600">Unlock advanced insights, unlimited habits, and priority support.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to evolve?</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of users who are transforming their lives with Evolv.
              </p>
              <Button 
                size="lg" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0 px-6 py-3"
                onClick={() => window.location.href = '/api/login'}
              >
                <i className="fas fa-rocket mr-2"></i>
                Start Your Journey
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                <i className="fas fa-shield-alt mr-1 text-evolv-primary"></i>
                Secure authentication • Join thousands improving their health
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
