import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Biohack {
  id: number;
  name: string;
  description: string;
  timeRequired: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  imageUrl?: string;
}

interface BookmarkedBiohack {
  biohackId: number;
  biohack?: {
    id: number;
  };
}

export function BiohacksSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: biohacks = [] } = useQuery<Biohack[]>({
    queryKey: ["/api/biohacks"],
  });

  const { data: bookmarkedBiohacks = [] } = useQuery<BookmarkedBiohack[]>({
    queryKey: ["/api/biohacks/bookmarked"],
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (biohackId: number) => {
      const response = await apiRequest("POST", `/api/biohacks/${biohackId}/bookmark`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/biohacks/bookmarked"] });
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
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    },
  });

  const bookmarkedIds = new Set(bookmarkedBiohacks.map((b) => b.biohackId || b.biohack?.id));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBookmark = (biohackId: number) => {
    bookmarkMutation.mutate(biohackId);
  };

  // Show first 3 biohacks
  const displayBiohacks = biohacks.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Recommended Biohacks</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            Explore All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {displayBiohacks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Loading biohacks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBiohacks.map((biohack) => {
              const isBookmarked = bookmarkedIds.has(biohack.id);
              
              return (
                <div
                  key={biohack.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {biohack.imageUrl && (
                    <img
                      src={biohack.imageUrl}
                      alt={biohack.name}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{biohack.name}</h3>
                      <button
                        onClick={() => handleBookmark(biohack.id)}
                        disabled={bookmarkMutation.isPending}
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {biohack.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{biohack.timeRequired}</span>
                      <Badge
                        variant="secondary"
                        className={getDifficultyColor(biohack.difficulty)}
                      >
                        {biohack.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
