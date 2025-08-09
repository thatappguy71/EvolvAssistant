import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  category: z.string().min(1, "Category is required"),
  timeRequired: z.string().min(1, "Time required is required"),
  description: z.string().optional(),
  difficulty: z.string().default("Easy"),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: any;
}

export default function HabitModal({ isOpen, onClose, habit }: HabitModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || "",
      category: habit?.category || "",
      timeRequired: habit?.timeRequired || "",
      description: habit?.description || "",
      difficulty: habit?.difficulty || "Easy",
    },
  });

  const createHabitMutation = useMutation({
    mutationFn: async (data: HabitFormData) => {
      await apiRequest('POST', '/api/habits', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      form.reset();
      onClose();
      toast({
        title: "Success",
        description: "Habit created successfully!",
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

  const onSubmit = (data: HabitFormData) => {
    createHabitMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning Meditation"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => form.setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                <SelectItem value="Exercise">Exercise</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
                <SelectItem value="Recovery">Recovery</SelectItem>
                <SelectItem value="Nutrition">Nutrition</SelectItem>
                <SelectItem value="Sleep">Sleep</SelectItem>
                <SelectItem value="Focus">Focus</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="timeRequired">Time Required</Label>
            <Input
              id="timeRequired"
              placeholder="e.g., 15 minutes"
              {...form.register("timeRequired")}
            />
            {form.formState.errors.timeRequired && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.timeRequired.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select onValueChange={(value) => form.setValue("difficulty", value)} defaultValue="Easy">
              <SelectTrigger>
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your habit..."
              {...form.register("description")}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createHabitMutation.isPending}
              className="flex-1"
            >
              {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
