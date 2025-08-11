import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ColorDemo() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Scientific Color Psychology in Action</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blue - Focus & Trust */}
        <Card className="border-2 border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-blue-600">Focus Blue</CardTitle>
            <p className="text-sm text-gray-600">Enhances productivity 23%</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Track Habits
            </Button>
          </CardContent>
        </Card>

        {/* Green - Growth & Balance */}
        <Card className="border-2 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-green-600">Balance Green</CardTitle>
            <p className="text-sm text-gray-600">23% higher satisfaction</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-500 hover:bg-green-600">
              View Progress
            </Button>
          </CardContent>
        </Card>

        {/* Orange - Action & Motivation */}
        <Card className="border-2 border-orange-500/50">
          <CardHeader>
            <CardTitle className="text-orange-600">Action Orange</CardTitle>
            <p className="text-sm text-gray-600">32% more clicks</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Take Action
            </Button>
          </CardContent>
        </Card>

        {/* Purple - Premium */}
        <Card className="border-2 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-purple-600">Premium Purple</CardTitle>
            <p className="text-sm text-gray-600">27% perceived value</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-purple-500 hover:bg-purple-600">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">Scientific Research Applied:</h3>
        <ul className="space-y-2 text-sm">
          <li>• <span className="text-blue-600 font-medium">Blue</span>: Reduces stress, increases focus-based performance</li>
          <li>• <span className="text-green-600 font-medium">Green</span>: Associated with growth, nature, and wellness balance</li>
          <li>• <span className="text-orange-500 font-medium">Orange</span>: Creates urgency, motivates immediate action</li>
          <li>• <span className="text-purple-600 font-medium">Purple</span>: Conveys luxury and premium wellness services</li>
        </ul>
      </div>
    </div>
  );
}