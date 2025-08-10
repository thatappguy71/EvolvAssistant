import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Bookmark, Clock, ArrowRight } from "lucide-react";

interface Biohack {
  id: number;
  name: string;
  description: string;
  timeRequired: string;
  difficulty: string;
  imageUrl?: string;
  isBookmarked?: boolean;
}

interface BiohackCardProps {
  biohack: Biohack;
  onClick?: (biohack: Biohack) => void;
}

export default function BiohackCard({ biohack, onClick }: BiohackCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/biohacks/${biohack.id}/bookmark`, {});
      return response;
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/biohacks'] });

      // Snapshot the previous value
      const previousBiohacks = queryClient.getQueryData(['/api/biohacks']);

      // Optimistically update to the new value
      queryClient.setQueryData(['/api/biohacks'], (old: any[]) => {
        if (!old) return old;
        return old.map((b: any) => 
          b.id === biohack.id 
            ? { ...b, isBookmarked: !b.isBookmarked }
            : b
        );
      });

      // Return a context object with the snapshotted value
      return { previousBiohacks };
    },
    onError: (error, variables, context) => {
      // Rollback to the previous value
      if (context?.previousBiohacks) {
        queryClient.setQueryData(['/api/biohacks'], context.previousBiohacks);
      }

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
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['/api/biohacks'] });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div 
      className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] bg-white dark:bg-gray-800"
      onClick={() => onClick?.(biohack)}
    >
      <img 
        src={biohack.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"} 
        alt={biohack.name}
        className="w-full h-32 object-cover"
        onError={(e) => {
          console.log('BiohackCard image failed to load:', biohack.imageUrl);
          e.currentTarget.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300";
        }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{biohack.name}</h3>
          <div className="flex items-center space-x-2">
            <button 
              className={`transition-colors ${
                biohack.isBookmarked 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-primary'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                bookmarkMutation.mutate();
              }}
              disabled={bookmarkMutation.isPending}
            >
              <Bookmark className={`h-4 w-4 ${biohack.isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{biohack.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{biohack.timeRequired}</span>
          </div>
          <span className={`px-2 py-1 rounded-full ${getDifficultyColor(biohack.difficulty)}`}>
            {biohack.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
