import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessageSquare, Bug, Lightbulb, Star, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "general", "usability"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stepsToReproduce: z.string().optional(),
  expectedBehavior: z.string().optional(),
  actualBehavior: z.string().optional(),
  browserInfo: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function BetaFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "general",
      priority: "medium",
      title: "",
      description: "",
      stepsToReproduce: "",
      expectedBehavior: "",
      actualBehavior: "",
      browserInfo: navigator.userAgent,
    },
  });

  const submitFeedback = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const response = await apiRequest("POST", "/api/beta-feedback", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/beta-feedback"] });
    },
    onError: (error) => {
      console.error("Feedback submission error:", error);
      
      // Check if it's an authentication error
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit feedback. Redirecting...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 2000);
        return;
      }
      
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message || "Please try again or contact support."}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    setIsSubmitting(true);
    submitFeedback.mutate(data);
    setIsSubmitting(false);
  };

  const feedbackTypes = [
    { value: "bug", label: "Bug Report", icon: Bug, color: "bg-red-100 text-red-800" },
    { value: "feature", label: "Feature Request", icon: Lightbulb, color: "bg-blue-100 text-blue-800" },
    { value: "usability", label: "Usability Issue", icon: MessageSquare, color: "bg-orange-100 text-orange-800" },
    { value: "general", label: "General Feedback", icon: Star, color: "bg-green-100 text-green-800" },
  ];

  // Show login requirement if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beta Testing Feedback</h1>
          <p className="text-gray-600 mb-6">
            Authentication required to submit feedback
          </p>
          <Button onClick={() => window.location.href = "/api/login"}>
            Log in to Submit Feedback
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Beta Testing Feedback</h1>
        <p className="text-gray-600">
          Help us improve Evolv by sharing your experience, reporting bugs, or suggesting new features.
        </p>
      </div>

      {/* Testing Guidelines */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Beta Testing Focus Areas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Core Features to Test:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Habit creation and daily completion</li>
                <li>• Streak tracking accuracy</li>
                <li>• Daily metrics recording</li>
                <li>• Location-based content delivery</li>
                <li>• Daily content rotation (try same habit multiple days)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Advanced Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Payment flow (use test cards only)</li>
                <li>• AI recommendations system</li>
                <li>• Biohack bookmarking</li>
                <li>• Interactive biohack tools</li>
                <li>• Profile management</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Test Cards for Payments:</strong> Use 4242424242424242 (Visa), 4000056655665556 (Visa Debit), 
              or 5555555555554444 (Mastercard) with any future date and CVC.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Feedback Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => form.setValue("type", type.value as any)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      form.watch("type") === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-900 dark:text-blue-800"
                        : "border-gray-200 hover:border-gray-300 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <type.icon className={`h-6 w-6 mx-auto mb-2 ${
                      form.watch("type") === type.value ? "text-blue-600 dark:text-blue-500" : "text-gray-600 dark:text-gray-400"
                    }`} />
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low - Minor improvement</SelectItem>
                          <SelectItem value="medium">Medium - Notable issue</SelectItem>
                          <SelectItem value="high">High - Major problem</SelectItem>
                          <SelectItem value="critical">Critical - App breaking</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue/Suggestion Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed information about the issue, suggestion, or feedback..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("type") === "bug" && (
                <div className="space-y-4 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900">Bug Report Details</h4>
                  
                  <FormField
                    control={form.control}
                    name="stepsToReproduce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Steps to Reproduce</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="1. Go to... 2. Click on... 3. Notice that..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expectedBehavior"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Behavior</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What should have happened?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actualBehavior"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Actual Behavior</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What actually happened?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || submitFeedback.isPending}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting || submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}