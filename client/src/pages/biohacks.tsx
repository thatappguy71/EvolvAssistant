import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import BiohackCard from "@/components/BiohackCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Bookmark, ArrowLeft, Play, Pause, Timer, ThermometerSun, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Biohacks() {
  const [selectedBiohack, setSelectedBiohack] = useState<any>(null);
  const [isBiohackDetailOpen, setIsBiohackDetailOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<'focus' | 'relaxation' | 'sleep'>('focus');
  
  const { isCollapsed } = useSidebar();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
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
    // Clean up any running timers or audio
    stopTimer();
    stopBreathingExercise();
    stopBinauralBeats();
  };

  // Timer functionality
  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          toast({
            title: "Timer Complete!",
            description: "Your biohack session is finished.",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Breathing exercise functionality
  const startBreathingExercise = () => {
    setBreathingCount(0);
    setBreathingPhase('inhale');
    breathingCycle();
  };

  const breathingCycle = () => {
    const phases = [
      { phase: 'inhale' as const, duration: 4000, message: 'Breathe In' },
      { phase: 'hold' as const, duration: 4000, message: 'Hold' },
      { phase: 'exhale' as const, duration: 4000, message: 'Breathe Out' },
      { phase: 'pause' as const, duration: 4000, message: 'Pause' }
    ];

    let currentPhaseIndex = 0;

    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setBreathingPhase(currentPhase.phase);
      
      breathingTimerRef.current = setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        if (currentPhaseIndex === 0) {
          setBreathingCount(prev => prev + 1);
        }
        runPhase();
      }, currentPhase.duration);
    };

    runPhase();
  };

  const stopBreathingExercise = () => {
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
    setBreathingPhase('inhale');
    setBreathingCount(0);
  };

  // Binaural beats functionality
  const frequencies = {
    focus: { left: 220, right: 230, name: 'Alpha Waves (10Hz) - Focus' },
    relaxation: { left: 200, right: 206, name: 'Theta Waves (6Hz) - Relaxation' },
    sleep: { left: 180, right: 184, name: 'Delta Waves (4Hz) - Sleep' }
  };

  const startBinauralBeats = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.1; // Low volume
    }

    const { left, right } = frequencies[currentFrequency];
    
    // Create stereo oscillators
    const leftOscillator = audioContextRef.current.createOscillator();
    const rightOscillator = audioContextRef.current.createOscillator();
    const leftGain = audioContextRef.current.createGain();
    const rightGain = audioContextRef.current.createGain();
    const merger = audioContextRef.current.createChannelMerger(2);

    leftOscillator.frequency.value = left;
    rightOscillator.frequency.value = right;
    leftGain.gain.value = 0.1;
    rightGain.gain.value = 0.1;

    leftOscillator.connect(leftGain);
    rightOscillator.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(audioContextRef.current.destination);

    leftOscillator.start();
    rightOscillator.start();

    oscillatorRef.current = leftOscillator; // Store for cleanup
    setIsPlayingAudio(true);

    toast({
      title: "Binaural Beats Started",
      description: `Playing ${frequencies[currentFrequency].name}`,
    });
  };

  const stopBinauralBeats = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopBreathingExercise();
      stopBinauralBeats();
    };
  }, []);

  const bookmarkMutation = useMutation({
    mutationFn: async (biohackId: number) => {
      const response = await apiRequest('POST', `/api/biohacks/${biohackId}/bookmark`, {});
      return response;
    },
    onMutate: async (biohackId: number) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/biohacks'] });

      // Snapshot the previous value
      const previousBiohacks = queryClient.getQueryData(['/api/biohacks']);

      // Optimistically update the biohacks list
      queryClient.setQueryData(['/api/biohacks'], (old: any[]) => {
        if (!old) return old;
        return old.map((b: any) => 
          b.id === biohackId 
            ? { ...b, isBookmarked: !b.isBookmarked }
            : b
        );
      });

      // Update the selected biohack in the modal
      if (selectedBiohack?.id === biohackId) {
        setSelectedBiohack((prev: any) => ({
          ...prev,
          isBookmarked: !prev.isBookmarked
        }));
      }

      return { previousBiohacks, previousSelectedBiohack: selectedBiohack };
    },
    onError: (error, biohackId, context) => {
      // Rollback to the previous value
      if (context?.previousBiohacks) {
        queryClient.setQueryData(['/api/biohacks'], context.previousBiohacks);
      }
      if (context?.previousSelectedBiohack) {
        setSelectedBiohack(context.previousSelectedBiohack);
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

                {/* Interactive Tools Section */}
                {selectedBiohack && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Interactive Tools</h4>
                    
                    {/* Binaural Beats Player */}
                    {selectedBiohack.name === "Binaural Beats" && (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(frequencies).map(([key, freq]) => (
                            <Badge
                              key={key}
                              variant={currentFrequency === key ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setCurrentFrequency(key as any)}
                            >
                              {freq.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={isPlayingAudio ? stopBinauralBeats : startBinauralBeats}
                            variant={isPlayingAudio ? "destructive" : "default"}
                            size="sm"
                          >
                            {isPlayingAudio ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            {isPlayingAudio ? 'Stop Audio' : 'Play Frequency'}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">Use headphones for best effect. Volume is set to safe levels.</p>
                      </div>
                    )}

                    {/* Breathing Timer for Wim Hof and Box Breathing */}
                    {(selectedBiohack.name === "Wim Hof Breathing" || selectedBiohack.name === "Box Breathing") && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-2">
                            {breathingPhase === 'inhale' && '🫁 Breathe In'}
                            {breathingPhase === 'hold' && '⏸️ Hold'}
                            {breathingPhase === 'exhale' && '💨 Breathe Out'}
                            {breathingPhase === 'pause' && '⏳ Pause'}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cycle: {breathingCount} | Phase: {breathingPhase}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={breathingTimerRef.current ? stopBreathingExercise : startBreathingExercise}
                            variant={breathingTimerRef.current ? "destructive" : "default"}
                            size="sm"
                          >
                            <Waves className="h-4 w-4 mr-2" />
                            {breathingTimerRef.current ? 'Stop Exercise' : 'Start Breathing'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Session Timer */}
                    {(selectedBiohack.name === "Meditation" || selectedBiohack.name === "Red Light Therapy" || 
                      selectedBiohack.name === "Sauna Therapy" || selectedBiohack.name === "Forest Bathing") && (
                      <div className="space-y-4">
                        <div className="text-center">
                          {isTimerRunning && (
                            <div className="mb-4">
                              <div className="text-3xl font-bold">
                                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                              </div>
                              <Progress 
                                value={timerSeconds > 0 ? ((parseInt(selectedBiohack.timeRequired) * 60 - timerSeconds) / (parseInt(selectedBiohack.timeRequired) * 60)) * 100 : 0} 
                                className="mt-2"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            onClick={() => startTimer(5)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            5 min
                          </Button>
                          <Button
                            onClick={() => startTimer(10)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            10 min
                          </Button>
                          <Button
                            onClick={() => startTimer(20)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            20 min
                          </Button>
                          {isTimerRunning && (
                            <Button
                              onClick={stopTimer}
                              variant="destructive"
                              size="sm"
                            >
                              Stop Timer
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cold Exposure Temperature Guide */}
                    {(selectedBiohack.name === "Cold Exposure Therapy" || selectedBiohack.name === "Contrast Showers") && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <span className="text-sm">Beginner</span>
                            <span className="text-sm font-medium">60-70°F (15-21°C)</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
                            <span className="text-sm">Intermediate</span>
                            <span className="text-sm font-medium">50-60°F (10-15°C)</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-blue-200 dark:bg-blue-700/40 rounded">
                            <span className="text-sm">Advanced</span>
                            <span className="text-sm font-medium">40-50°F (4-10°C)</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => startTimer(2)}
                          variant="outline"
                          size="sm"
                          disabled={isTimerRunning}
                          className="w-full"
                        >
                          <ThermometerSun className="h-4 w-4 mr-2" />
                          Start 2-min Timer
                        </Button>
                      </div>
                    )}

                    {/* HIIT Timer */}
                    {selectedBiohack.name === "High-Intensity Interval Training" && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            20 seconds work, 40 seconds rest × 8 rounds
                          </p>
                        </div>
                        <Button
                          onClick={() => startTimer(8)}
                          variant="default"
                          size="sm"
                          disabled={isTimerRunning}
                          className="w-full"
                        >
                          <Timer className="h-4 w-4 mr-2" />
                          Start HIIT Timer (8 minutes)
                        </Button>
                      </div>
                    )}
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
                    if (selectedBiohack?.id) {
                      bookmarkMutation.mutate(selectedBiohack.id);
                    }
                  }}
                  variant="default"
                  className={`flex-1 ${selectedBiohack.isBookmarked ? 'bg-primary' : ''}`}
                  disabled={bookmarkMutation.isPending}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${selectedBiohack.isBookmarked ? 'fill-current' : ''}`} />
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
