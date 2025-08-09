import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddHabitModal({ open, onOpenChange }: AddHabitModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    timeRequired: "",
    difficulty: "Easy" as const,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createHabitMutation = useMutation({
    mutationFn: async (habitData: typeof formData) => {
      const response = await apiRequest("POST", "/api/habits", habitData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Success",
        description: "Habit created successfully",
      });
      onOpenChange(false);
      setFormData({
        name: "",
        category: "",
        description: "",
        timeRequired: "",
        difficulty: "Easy",
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
        description: "Failed to create habit",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.timeRequired) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createHabitMutation.mutate(formData);
  };

  const categories = [
    "Mindfulness",
    "Exercise", 
    "Learning",
    "Recovery",
    "Nutrition",
    "Sleep",
    "Focus",
    "Social",
    "Creative"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Habit Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Meditation"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeRequired" className="text-sm font-medium text-gray-700">
              Time Required *
            </Label>
            <Input
              id="timeRequired"
              type="text"
              value={formData.timeRequired}
              onChange={(e) => setFormData({ ...formData, timeRequired: e.target.value })}
              placeholder="e.g., 15 minutes"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700">
              Difficulty
            </Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value: "Easy" | "Medium" | "Hard") => 
                setFormData({ ...formData, difficulty: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your habit..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createHabitMutation.isPending}
            >
              {createHabitMutation.isPending ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
