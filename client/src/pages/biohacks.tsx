import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import BiohackCard from "@/components/BiohackCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Bookmark, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Biohacks() {
  const [selectedBiohack, setSelectedBiohack] = useState<any>(null);
  const [isBiohackDetailOpen, setIsBiohackDetailOpen] = useState(false);
  const { isCollapsed } = useSidebar();
  const { data: biohacks = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/biohacks'],
  });

  const handleBiohackClick = (biohack: any) => {
    setSelectedBiohack(biohack);
    setIsBiohackDetailOpen(true);
  };

  const handleCloseBiohackDetail = () => {
    setIsBiohackDetailOpen(false);
    setSelectedBiohack(null);
  };

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
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 pt-20 md:pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Biohacks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Discover scientifically-backed techniques to optimize your health</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biohacks.map((biohack: any) => (
                <BiohackCard 
                  key={biohack.id} 
                  biohack={biohack} 
                  onClick={handleBiohackClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Biohack Detail Modal */}
      <Dialog open={isBiohackDetailOpen} onOpenChange={setIsBiohackDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedBiohack?.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(selectedBiohack?.difficulty || '')}`}>
                {selectedBiohack?.difficulty}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBiohack && (
            <div className="space-y-6">
              {/* Biohack Image */}
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={selectedBiohack.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200"} 
                  alt={selectedBiohack.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Biohack Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedBiohack.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Time Required</h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedBiohack.timeRequired}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Category</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBiohack.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Benefits Section */}
                {selectedBiohack.benefits && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Benefits</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {selectedBiohack.benefits.split('\n').map((benefit: string, index: number) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions Section */}
                {selectedBiohack.instructions && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">How to Do It</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedBiohack.instructions.split('\n').map((instruction: string, index: number) => (
                        <p key={index} className="mb-2">{instruction}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={handleCloseBiohackDetail}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Biohacks
                </Button>
                
                <Button
                  onClick={() => {
                    // Add bookmark functionality here if needed
                    handleCloseBiohackDetail();
                  }}
                  variant="default"
                  className="flex-1"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {selectedBiohack.isBookmarked ? 'Remove Bookmark' : 'Bookmark This'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
