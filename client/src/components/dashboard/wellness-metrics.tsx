import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface DailyMetric {
  energy: number;
  focus: number;
  mood: number;
  productivity: number;
  sleepQuality: number;
}

interface WellnessMetricsProps {
  todaysMetrics?: DailyMetric;
}

export function WellnessMetrics({ todaysMetrics }: WellnessMetricsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMetricsMutation = useMutation({
    mutationFn: async (metrics: Partial<DailyMetric>) => {
      const response = await apiRequest("POST", "/api/metrics", metrics);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success",
        description: "Metrics updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update metrics",
        variant: "destructive",
      });
    },
  });

  const defaultMetrics: DailyMetric = {
    energy: 5,
    focus: 5,
    mood: 5,
    productivity: 5,
    sleepQuality: 5,
  };

  const metrics = todaysMetrics || defaultMetrics;

  const metricItems = [
    {
      name: "Energy",
      key: "energy" as keyof DailyMetric,
      value: metrics.energy,
      color: "bg-green-500",
    },
    {
      name: "Focus",
      key: "focus" as keyof DailyMetric,
      value: metrics.focus,
      color: "bg-blue-500",
    },
    {
      name: "Mood",
      key: "mood" as keyof DailyMetric,
      value: metrics.mood,
      color: "bg-purple-500",
    },
    {
      name: "Productivity",
      key: "productivity" as keyof DailyMetric,
      value: metrics.productivity,
      color: "bg-indigo-500",
    },
    {
      name: "Sleep Quality",
      key: "sleepQuality" as keyof DailyMetric,
      value: metrics.sleepQuality,
      color: "bg-yellow-500",
    },
  ];

  const handleUpdateMetrics = () => {
    // For demo purposes, update with sample values
    const updatedMetrics = {
      energy: Math.floor(Math.random() * 4) + 7, // 7-10
      focus: Math.floor(Math.random() * 4) + 6,  // 6-9
      mood: Math.floor(Math.random() * 3) + 8,   // 8-10
      productivity: Math.floor(Math.random() * 4) + 6, // 6-9
      sleepQuality: Math.floor(Math.random() * 4) + 5, // 5-8
    };
    updateMetricsMutation.mutate(updatedMetrics);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">Today's Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metricItems.map((metric) => (
            <div key={metric.key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                <span className="text-sm font-bold text-gray-900">{metric.value}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${metric.color}`}
                  style={{ width: `${(metric.value / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button
          className="w-full mt-6"
          variant="outline"
          onClick={handleUpdateMetrics}
          disabled={updateMetricsMutation.isPending}
        >
          {updateMetricsMutation.isPending ? "Updating..." : "Update Metrics"}
        </Button>
      </CardContent>
    </Card>
  );
}
