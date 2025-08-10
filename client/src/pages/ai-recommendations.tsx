import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  RefreshCw, 
  BookmarkPlus, 
  Bookmark, 
  Target, 
  Lightbulb, 
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";

interface AIRecommendation {
  id: number;
  type: 'habit' | 'biohack' | 'insight' | 'goal';
  title: string;
  description: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  estimatedBenefit: string;
  timeCommitment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isRead: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

const typeIcons = {
  habit: Target,
  biohack: Zap,
  insight: Lightbulb,
  goal: TrendingUp
};

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

export default function AIRecommendations() {
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: recommendations = [] as AIRecommendation[], 
    isLoading 
  } = useQuery<AIRecommendation[]>({
    queryKey: ['/api/recommendations'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const generateFreshMutation = useMutation({
    mutationFn: () => apiRequest('/api/recommendations/generate', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      toast({
        title: "Fresh Recommendations Generated",
        description: "Your AI wellness recommendations have been updated based on your latest data.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate new recommendations. Please try again.",
        variant: "destructive",
      });
    }
  });

  const bookmarkMutation = useMutation({
    mutationFn: ({ id }: { id: number; isBookmarked: boolean }) =>
      apiRequest(`/api/recommendations/${id}/bookmark`, 'POST'),
    onMutate: async ({ id, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: ['/api/recommendations'] });
      const previousRecommendations = queryClient.getQueryData(['/api/recommendations']);
      
      queryClient.setQueryData(['/api/recommendations'], (old: AIRecommendation[]) => 
        old.map(rec => rec.id === id ? { ...rec, isBookmarked: !isBookmarked } : rec)
      );
      
      return { previousRecommendations };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['/api/recommendations'], context?.previousRecommendations);
      toast({
        title: "Bookmark Failed",
        description: "Failed to bookmark recommendation. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/recommendations/${id}/read`, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    }
  });

  const handleRecommendationClick = (recommendation: AIRecommendation) => {
    setSelectedRecommendation(recommendation);
    if (!recommendation.isRead) {
      markAsReadMutation.mutate(recommendation.id);
    }
  };

  const handleBookmarkToggle = (recommendation: AIRecommendation, e: React.MouseEvent) => {
    e.stopPropagation();
    bookmarkMutation.mutate({ 
      id: recommendation.id, 
      isBookmarked: recommendation.isBookmarked 
    });
  };

  const handleTakeAction = (recommendation: AIRecommendation) => {
    // Based on recommendation type, navigate to appropriate page or show relevant action
    if (recommendation.type === 'habit') {
      // Navigate to habits page
      window.location.href = '/habits';
    } else if (recommendation.type === 'biohack') {
      // Navigate to biohacks page
      window.location.href = '/biohacks';
    } else if (recommendation.type === 'wellness') {
      // Navigate to wellness metrics page
      window.location.href = '/wellness';
    } else {
      // Default action - just close the modal and show toast
      setSelectedRecommendation(null);
      toast({
        title: "Action Noted",
        description: "Your wellness journey continues! Check your other pages for more tools and tracking.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">AI Wellness Recommendations</h1>
            <p className="text-muted-foreground">Personalized suggestions based on your wellness data</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">AI Wellness Recommendations</h1>
            <p className="text-muted-foreground">Personalized suggestions based on your wellness data</p>
          </div>
        </div>
        
        <Button
          onClick={() => generateFreshMutation.mutate()}
          disabled={generateFreshMutation.isPending}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${generateFreshMutation.isPending ? 'animate-spin' : ''}`} />
          Generate Fresh
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate your first AI-powered wellness recommendations by clicking the button above.
            </p>
            <Button onClick={() => generateFreshMutation.mutate()} disabled={generateFreshMutation.isPending}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Recommendations
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation) => {
            const TypeIcon = typeIcons[recommendation.type];
            
            return (
              <Card 
                key={recommendation.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 relative
                  ${!recommendation.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                `}
                onClick={() => handleRecommendationClick(recommendation)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-5 w-5 text-blue-500" />
                      <Badge className={priorityColors[recommendation.priority]}>
                        {recommendation.priority}
                      </Badge>
                      {recommendation.difficulty && (
                        <Badge variant="outline" className={difficultyColors[recommendation.difficulty]}>
                          {recommendation.difficulty}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleBookmarkToggle(recommendation, e)}
                      className="p-1 h-8 w-8"
                    >
                      {recommendation.isBookmarked ? (
                        <Bookmark className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <BookmarkPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                  {!recommendation.isRead && (
                    <div className="absolute top-2 left-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-3">
                    {recommendation.description}
                  </CardDescription>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {recommendation.timeCommitment && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recommendation.timeCommitment}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {recommendation.estimatedBenefit}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const TypeIcon = typeIcons[selectedRecommendation.type];
                    return <TypeIcon className="h-6 w-6 text-blue-500" />;
                  })()}
                  <div>
                    <CardTitle className="text-xl">{selectedRecommendation.title}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={priorityColors[selectedRecommendation.priority]}>
                        {selectedRecommendation.priority} priority
                      </Badge>
                      {selectedRecommendation.difficulty && (
                        <Badge variant="outline" className={difficultyColors[selectedRecommendation.difficulty]}>
                          {selectedRecommendation.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecommendation(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedRecommendation.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Why this recommendation?</h4>
                <p className="text-muted-foreground">{selectedRecommendation.reasoning}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRecommendation.timeCommitment && (
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Time Commitment
                    </h4>
                    <p className="text-muted-foreground">{selectedRecommendation.timeCommitment}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Expected Benefit
                  </h4>
                  <p className="text-muted-foreground">{selectedRecommendation.estimatedBenefit}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={(e) => {
                    handleBookmarkToggle(selectedRecommendation, e);
                    setSelectedRecommendation(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
                  }}
                  variant={selectedRecommendation.isBookmarked ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  {selectedRecommendation.isBookmarked ? (
                    <>
                      <Bookmark className="h-4 w-4" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="h-4 w-4" />
                      Bookmark
                    </>
                  )}
                </Button>
                
                {selectedRecommendation.actionable && (
                  <Button 
                    variant="default"
                    onClick={() => handleTakeAction(selectedRecommendation)}
                  >
                    Take Action
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}