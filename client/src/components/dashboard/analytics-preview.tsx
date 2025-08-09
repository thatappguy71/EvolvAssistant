import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressChart } from "@/components/charts/progress-chart";

interface AnalyticsPreviewProps {
  recentMetrics: any[];
}

export function AnalyticsPreview({ recentMetrics }: AnalyticsPreviewProps) {
  // Transform metrics data for charts
  const chartData = recentMetrics.map((metric, index) => ({
    date: new Date(metric.date).toLocaleDateString(),
    wellness: (metric.energy + metric.focus + metric.mood + metric.productivity + metric.sleepQuality) / 5,
    completion: Math.floor(Math.random() * 30) + 70, // Mock completion data
  })).reverse();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Habit Completion Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-900">Habit Completion Trends</CardTitle>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressChart 
            data={chartData} 
            dataKey="completion"
            color="#2563EB"
            height={200}
          />
        </CardContent>
      </Card>

      {/* Wellness Score History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-900">Wellness Score History</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Current:</span>
              <span className="text-lg font-bold text-green-500">
                {chartData.length > 0 ? chartData[chartData.length - 1]?.wellness.toFixed(1) : "0.0"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressChart 
            data={chartData} 
            dataKey="wellness"
            color="#10B981"
            height={200}
            area={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
