import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { MessageSquare, Bug, Lightbulb, Star, Clock, CheckCircle, XCircle, AlertTriangle, Users } from "lucide-react";

interface BetaFeedback {
  id: number;
  userId: string;
  type: "bug" | "feature" | "general" | "usability";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  browserInfo?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
}

const feedbackTypes = {
  bug: { label: "Bug Report", icon: Bug, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  feature: { label: "Feature Request", icon: Lightbulb, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  usability: { label: "Usability Issue", icon: MessageSquare, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  general: { label: "General Feedback", icon: Star, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const statusIcons = {
  open: Clock,
  in_progress: AlertTriangle,
  resolved: CheckCircle,
  closed: XCircle,
};

export default function FeedbackAdmin() {
  const { isCollapsed } = useSidebar();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: allFeedback = [], isLoading } = useQuery({
    queryKey: ["/api/beta-feedback/all"],
    queryFn: async () => {
      const response = await fetch("/api/beta-feedback/all", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch feedback");
      return response.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ feedbackId, status }: { feedbackId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/beta-feedback/${feedbackId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Feedback status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/beta-feedback/all"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update feedback status.",
        variant: "destructive",
      });
    },
  });

  const filteredFeedback = allFeedback.filter((feedback: BetaFeedback) => 
    selectedStatus === "all" || feedback.status === selectedStatus
  );

  const groupedFeedback = filteredFeedback.reduce((groups: Record<string, BetaFeedback[]>, feedback: BetaFeedback) => {
    if (!groups[feedback.type]) {
      groups[feedback.type] = [];
    }
    groups[feedback.type].push(feedback);
    return groups;
  }, {});

  const stats = {
    total: allFeedback.length,
    open: allFeedback.filter((f: BetaFeedback) => f.status === "open").length,
    inProgress: allFeedback.filter((f: BetaFeedback) => f.status === "in_progress").length,
    resolved: allFeedback.filter((f: BetaFeedback) => f.status === "resolved").length,
    critical: allFeedback.filter((f: BetaFeedback) => f.priority === "critical").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
          <DashboardHeader />
          <div className="p-8 pt-24">
            <div className="text-center">Loading feedback...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 pt-20 md:pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feedback Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Review and manage user feedback submissions</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.open}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.critical}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Controls */}
          <div className="mb-6">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feedback List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({filteredFeedback.length})</TabsTrigger>
              <TabsTrigger value="bug">Bugs ({(groupedFeedback.bug || []).length})</TabsTrigger>
              <TabsTrigger value="feature">Features ({(groupedFeedback.feature || []).length})</TabsTrigger>
              <TabsTrigger value="usability">Usability ({(groupedFeedback.usability || []).length})</TabsTrigger>
              <TabsTrigger value="general">General ({(groupedFeedback.general || []).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredFeedback.map((feedback: BetaFeedback) => (
                <FeedbackCard 
                  key={feedback.id} 
                  feedback={feedback} 
                  onStatusUpdate={(feedbackId, status) => updateStatusMutation.mutate({ feedbackId, status })}
                />
              ))}
            </TabsContent>

            {Object.entries(groupedFeedback).map(([type, feedbackList]) => (
              <TabsContent key={type} value={type} className="space-y-4">
                {(feedbackList as BetaFeedback[]).map((feedback: BetaFeedback) => (
                  <FeedbackCard 
                    key={feedback.id} 
                    feedback={feedback} 
                    onStatusUpdate={(feedbackId, status) => updateStatusMutation.mutate({ feedbackId, status })}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>

          {filteredFeedback.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No feedback submissions found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function FeedbackCard({ 
  feedback, 
  onStatusUpdate 
}: { 
  feedback: BetaFeedback; 
  onStatusUpdate: (feedbackId: number, status: string) => void;
}) {
  const typeConfig = feedbackTypes[feedback.type];
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusIcons[feedback.status];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <TypeIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={typeConfig.color}>
                  {typeConfig.label}
                </Badge>
                <Badge className={priorityColors[feedback.priority]}>
                  {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                </Badge>
                <Badge className={statusColors[feedback.status]}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {feedback.status.replace('_', ' ').charAt(0).toUpperCase() + feedback.status.replace('_', ' ').slice(1)}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {feedback.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submitted {new Date(feedback.createdAt).toLocaleDateString()} by User {feedback.userId}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Select 
              value={feedback.status} 
              onValueChange={(status) => onStatusUpdate(feedback.id, status)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{feedback.description}</p>
          </div>
          
          {feedback.stepsToReproduce && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Steps to Reproduce</h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{feedback.stepsToReproduce}</p>
            </div>
          )}
          
          {feedback.expectedBehavior && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Expected Behavior</h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{feedback.expectedBehavior}</p>
            </div>
          )}
          
          {feedback.actualBehavior && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Actual Behavior</h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{feedback.actualBehavior}</p>
            </div>
          )}
          
          {feedback.browserInfo && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Browser Info</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{feedback.browserInfo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}