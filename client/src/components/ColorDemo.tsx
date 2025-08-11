import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeft, Brain, TrendingUp, Zap, Crown } from "lucide-react";
import { Link } from "wouter";

export default function ColorDemo() {
  const [clickCounts, setClickCounts] = useState({
    blue: 0,
    green: 0,
    orange: 0,
    purple: 0
  });

  const handleClick = (color: keyof typeof clickCounts) => {
    setClickCounts(prev => ({
      ...prev,
      [color]: prev[color] + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            🧠 Scientific Color Psychology in Action
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience how different colors influence your behavior and emotions. 
            Each color below is scientifically proven to enhance specific psychological responses.
          </p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Blue - Focus & Trust */}
          <Card className="border-2 border-blue-500/50 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-blue-600">Focus Blue</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enhances productivity 23%</p>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 transition-all transform hover:scale-105"
                onClick={() => handleClick('blue')}
              >
                Track Habits ({clickCounts.blue})
              </Button>
              <p className="text-xs text-center mt-2 text-gray-500">
                Notice how this blue makes you feel focused?
              </p>
            </CardContent>
          </Card>

          {/* Green - Growth & Balance */}
          <Card className="border-2 border-green-500/50 hover:border-green-500 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-green-600">Balance Green</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">23% higher satisfaction</p>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 transition-all transform hover:scale-105"
                onClick={() => handleClick('green')}
              >
                View Progress ({clickCounts.green})
              </Button>
              <p className="text-xs text-center mt-2 text-gray-500">
                Green creates a sense of calm growth
              </p>
            </CardContent>
          </Card>

          {/* Orange - Action & Motivation */}
          <Card className="border-2 border-orange-500/50 hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-orange-600">Action Orange</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">32% more clicks</p>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 transition-all transform hover:scale-105"
                onClick={() => handleClick('orange')}
              >
                Take Action! ({clickCounts.orange})
              </Button>
              <p className="text-xs text-center mt-2 text-gray-500">
                Orange triggers immediate action impulses
              </p>
            </CardContent>
          </Card>

          {/* Purple - Premium */}
          <Card className="border-2 border-purple-500/50 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-purple-600">Premium Purple</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">27% perceived value</p>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-purple-500 hover:bg-purple-600 transition-all transform hover:scale-105"
                onClick={() => handleClick('purple')}
              >
                Upgrade Now ({clickCounts.purple})
              </Button>
              <p className="text-xs text-center mt-2 text-gray-500">
                Purple conveys luxury and exclusivity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {(clickCounts.blue + clickCounts.green + clickCounts.orange + clickCounts.purple) > 0 && (
          <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-center">🎯 Your Click Pattern Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{clickCounts.blue}</div>
                  <div className="text-sm text-gray-600">Focus Blue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{clickCounts.green}</div>
                  <div className="text-sm text-gray-600">Balance Green</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{clickCounts.orange}</div>
                  <div className="text-sm text-gray-600">Action Orange</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{clickCounts.purple}</div>
                  <div className="text-sm text-gray-600">Premium Purple</div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Notice which colors you clicked more? That's color psychology in action!
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-center">🧠 Scientific Research Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="text-blue-600 font-medium">Blue</span>
                      <p className="text-sm text-gray-600">Reduces stress hormones by 15%, increases focus-based performance</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="text-green-600 font-medium">Green</span>
                      <p className="text-sm text-gray-600">Associated with growth, nature, and wellness balance. Increases satisfaction by 23%</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <div>
                      <span className="text-orange-500 font-medium">Orange</span>
                      <p className="text-sm text-gray-600">Creates urgency, motivates immediate action. Increases click-through rates by 32%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <div>
                      <span className="text-purple-600 font-medium">Purple</span>
                      <p className="text-sm text-gray-600">Conveys luxury and premium wellness services. Increases perceived value by 27%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
            <CardHeader>
              <CardTitle className="text-center">🚀 How Evolv Uses This Science</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Every color in Evolv is strategically chosen based on peer-reviewed research to enhance your wellness journey. 
                From habit tracking (blue for focus) to progress celebration (green for growth), 
                our color psychology creates an environment optimized for lasting behavior change.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-evolv-secondary to-evolv-success text-white">
                  Experience Evolv Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}