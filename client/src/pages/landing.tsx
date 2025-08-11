import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <i className="fas fa-leaf text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Evolv</h1>
              <p className="text-gray-600">Personal Wellness & Habit Tracker</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your life with intelligent habit tracking, wellness monitoring, and personalized biohacking insights.
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check-circle text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Habit Tracking</h3>
              <p className="text-gray-600">Build lasting habits with intelligent tracking, streaks, and personalized insights.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-secondary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Wellness Metrics</h3>
              <p className="text-gray-600">Monitor energy, focus, mood, and sleep quality with comprehensive analytics.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lightbulb text-accent text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Biohack Discovery</h3>
              <p className="text-gray-600">Explore scientifically-backed biohacks to optimize your health and performance.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-orange-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Visualize your progress with detailed charts and trend analysis.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-sync text-green-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Cloud Sync</h3>
              <p className="text-gray-600">Access your data anywhere with secure cloud synchronization.</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-crown text-purple-500 text-xl"></i>
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
                className="w-full"
                onClick={() => window.location.href = '/api/login'}
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Get Started
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Secure authentication powered by Replit
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
