import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface DailyMetrics {
  energy: number;
  focus: number;
  mood: number;
  productivity: number;
  sleepQuality: number;
}

export default function WellnessMetrics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  
  const { data: metrics } = useQuery({
    queryKey: ['/api/metrics', today],
    queryFn: async () => {
      const response = await fetch(`/api/metrics?date=${today}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    },
  });

  const [formData, setFormData] = useState<DailyMetrics>({
    energy: metrics?.energy || 5,
    focus: metrics?.focus || 5,
    mood: metrics?.mood || 5,
    productivity: metrics?.productivity || 5,
    sleepQuality: metrics?.sleepQuality || 5,
  });

  const updateMetricsMutation = useMutation({
    mutationFn: async (data: DailyMetrics) => {
      await apiRequest('POST', '/api/metrics', {
        ...data,
        date: today,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Wellness metrics updated successfully",
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
        description: "Failed to update wellness metrics",
        variant: "destructive",
      });
    },
  });

  const getMetricColor = (value: number) => {
    if (value >= 8) return 'bg-secondary';
    if (value >= 6) return 'bg-primary';
    if (value >= 4) return 'bg-warning';
    return 'bg-destructive';
  };

  const currentMetrics = metrics || {
    energy: 5,
    focus: 5,
    mood: 5,
    productivity: 5,
    sleepQuality: 5,
  };

  return (
    <div className="space-y-6">
      {/* Daily Metrics Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Metrics</h3>
        <div className="space-y-4">
          {/* Energy Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Energy</span>
              <span className="text-sm font-bold text-gray-900">{currentMetrics.energy}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getMetricColor(currentMetrics.energy)}`}
                style={{ width: `${currentMetrics.energy * 10}%` }}
              ></div>
            </div>
          </div>
          
          {/* Focus Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Focus</span>
              <span className="text-sm font-bold text-gray-900">{currentMetrics.focus}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getMetricColor(currentMetrics.focus)}`}
                style={{ width: `${currentMetrics.focus * 10}%` }}
              ></div>
            </div>
          </div>
          
          {/* Mood Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Mood</span>
              <span className="text-sm font-bold text-gray-900">{currentMetrics.mood}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getMetricColor(currentMetrics.mood)}`}
                style={{ width: `${currentMetrics.mood * 10}%` }}
              ></div>
            </div>
          </div>
          
          {/* Productivity Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Productivity</span>
              <span className="text-sm font-bold text-gray-900">{currentMetrics.productivity}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getMetricColor(currentMetrics.productivity)}`}
                style={{ width: `${currentMetrics.productivity * 10}%` }}
              ></div>
            </div>
          </div>
          
          {/* Sleep Quality */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Sleep Quality</span>
              <span className="text-sm font-bold text-gray-900">{currentMetrics.sleepQuality}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getMetricColor(currentMetrics.sleepQuality)}`}
                style={{ width: `${currentMetrics.sleepQuality * 10}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
              variant="outline"
            >
              Update Metrics
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Today's Metrics</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm font-medium capitalize">
                    {key === 'sleepQuality' ? 'Sleep Quality' : key}: {value}/10
                  </Label>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => 
                      setFormData(prev => ({ ...prev, [key]: newValue[0] }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateMetricsMutation.mutate(formData)}
                disabled={updateMetricsMutation.isPending}
                className="flex-1"
              >
                {updateMetricsMutation.isPending ? 'Saving...' : 'Save Metrics'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
