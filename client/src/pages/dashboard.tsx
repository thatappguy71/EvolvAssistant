import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import QuickStats from "@/components/QuickStats";
import TodaysHabits from "@/components/TodaysHabits";
import WellnessMetrics from "@/components/WellnessMetrics";
import BiohackCard from "@/components/BiohackCard";
import HabitModal from "@/components/HabitModal";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import OnboardingFlow from "@/components/dashboard/OnboardingFlow";
import QuickActions from "@/components/dashboard/QuickActions";
import StreakRewards from "@/components/gamification/StreakRewards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Bookmark, ArrowLeft, Play, Pause, Timer, Waves, Shield, Heart, Users, Phone, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { voiceService } from "@/lib/voiceService";

export default function Dashboard() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [selectedBiohack, setSelectedBiohack] = useState<any>(null);
  const [isBiohackDetailOpen, setIsBiohackDetailOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [, setLocation] = useLocation();
  const { isCollapsed } = useSidebar();
  const { toast } = useToast();

  // Interactive tool states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<'focus' | 'relaxation' | 'sleep'>('focus');

  // Refs for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const leftOscillatorRef = useRef<OscillatorNode | null>(null);
  const rightOscillatorRef = useRef<OscillatorNode | null>(null);

  const { data: stats } = useQuery<{
    currentStreak: number;
    habitsCompletedToday: number;
    totalHabitsToday: number;
    wellnessScore: number;
    weeklyProgress: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: biohacks = [] } = useQuery<any[]>({
    queryKey: ['/api/biohacks'],
  });

  const recommendedBiohacks = biohacks.slice(0, 3);

  // Check if user needs onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('evolv-onboarding-completed');
    if (!hasCompletedOnboarding && stats?.totalHabitsToday === 0) {
      setShowOnboarding(true);
    }
  }, [stats]);

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('evolv-onboarding-completed', 'true');
    localStorage.setItem('evolv-onboarding-data', JSON.stringify(data));
    setShowOnboarding(false);
    toast({
      title: "Welcome to Evolv!",
      description: "Your recovery journey starts now. Let's build some healthy habits!",
    });
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('evolv-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  const handleBiohackClick = (biohack: any) => {
    // Stop any running audio/timers when switching biohacks (without toast notifications)
    if (isPlayingAudio) {
      stopBinauralBeats(false);
    }
    if (isTimerRunning) {
      stopTimer(false);
    }
    if (breathingTimerRef.current) {
      stopBreathingExercise(false);
    }
    
    setSelectedBiohack(biohack);
    setIsBiohackDetailOpen(true);
  };

  const handleCloseBiohackDetail = () => {
    setIsBiohackDetailOpen(false);
    setSelectedBiohack(null);
    // Clean up any running timers or audio (without toast notifications)
    stopTimer(false);
    stopBreathingExercise(false);
    stopBinauralBeats(false);
    stopVoiceGuidance();
  };

  const handleExploreAll = () => {
    setLocation('/biohacks');
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

  // Voice guidance functions
  const stopVoiceGuidance = () => {
    voiceService.stop();
  };

  // Timer functions
  const startTimer = (minutes: number) => {
    const totalSeconds = minutes * 60;
    setTimerSeconds(totalSeconds);
    setIsTimerRunning(true);
    
    voiceService.speak(`Starting your ${minutes} minute ${selectedBiohack?.name || 'session'}... Find a comfortable position... close your eyes... and allow yourself to fully relax... into this healing experience.`);
    
    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          voiceService.speak(`Your session is complete... Take a moment to notice... how you feel... You've just taken an important step... in your wellness journey... Well done.`);
          toast({
            title: "Session Complete",
            description: `Your ${minutes} minute session is finished!`,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    toast({
      title: "Session Started",
      description: `${minutes} minute timer activated`,
    });
  };

  const stopTimer = (showToast = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
    setTimerSeconds(0);
    stopVoiceGuidance();
    if (showToast) {
      toast({
        title: "Session Stopped",
        description: "Your session has ended",
      });
    }
  };

  // Breathing exercise functions
  const startBreathingExercise = () => {
    setBreathingCount(0);
    setBreathingPhase('inhale');
    
    const exerciseType = selectedBiohack?.name === "Wim Hof Breathing" ? "Wim Hof" : "Box Breathing";
    voiceService.speak(`Beginning ${exerciseType}... Let's prepare your body and mind... Find a comfortable seated position... with your spine straight... Close your eyes... and follow my guidance... We'll start in a moment...`);
    
    // Start after initial guidance
    breathingTimerRef.current = setTimeout(() => {
      breathingCycle();
    }, 4000);
  };

  const breathingCycle = () => {
    const phases = [
      { phase: 'inhale' as const, duration: 4000, message: 'Breathe In', voiceText: 'Breathe in... slowly... and deeply' },
      { phase: 'hold' as const, duration: 4000, message: 'Hold', voiceText: 'Hold... your breath... gently' },
      { phase: 'exhale' as const, duration: 4000, message: 'Breathe Out', voiceText: 'Exhale... slowly... and completely' },
      { phase: 'pause' as const, duration: 4000, message: 'Pause', voiceText: 'Rest... and pause... naturally' }
    ];

    let currentPhaseIndex = 0;

    const runPhase = () => {
      // Check if the exercise is still active
      if (!breathingTimerRef.current && currentPhaseIndex > 0) return;
      
      const currentPhase = phases[currentPhaseIndex];
      setBreathingPhase(currentPhase.phase);
      
      // Provide voice guidance for each phase
      voiceService.speak(currentPhase.voiceText, { rate: 0.7, pitch: 1.1 });
      
      breathingTimerRef.current = setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        if (currentPhaseIndex === 0) {
          setBreathingCount(prev => {
            const newCount = prev + 1;
            // Encouragement every few cycles with gentle pauses
            if (newCount === 3) {
              voiceService.speak("Excellent... You're finding your rhythm... Continue breathing with awareness.");
            } else if (newCount === 6) {
              voiceService.speak("Beautiful breathing... Feel your body relaxing... with each cycle.");
            } else if (newCount === 10) {
              voiceService.speak("You're doing wonderfully... Notice the calm settling... into your body and mind.");
            }
            return newCount;
          });
        }
        
        // Continue the cycle only if timer is still active
        if (breathingTimerRef.current) {
          runPhase();
        }
      }, currentPhase.duration);
    };

    runPhase();
  };

  const stopBreathingExercise = (showToast = true) => {
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
    setBreathingPhase('inhale');
    setBreathingCount(0);
    stopVoiceGuidance();
    if (showToast) {
      toast({
        title: "Breathing Exercise Stopped",
        description: "Your breathing session has ended",
      });
    }
  };

  // Binaural beats functionality
  const frequencies = {
    focus: { left: 220, right: 230, name: 'Alpha Waves (10Hz) - Focus' },
    relaxation: { left: 200, right: 206, name: 'Theta Waves (6Hz) - Relaxation' },
    sleep: { left: 180, right: 184, name: 'Delta Waves (4Hz) - Sleep' }
  };

  const startBinauralBeats = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = 0.1; // Low volume
      }

      const { left, right } = frequencies[currentFrequency];
      
      // Voice guidance for starting binaural beats with soothing cadence
      const frequencyName = frequencies[currentFrequency].name;
      const purpose = currentFrequency === 'focus' ? 'enhanced concentration and alertness' : 
                     currentFrequency === 'relaxation' ? 'deep relaxation and stress relief' :
                     'restful sleep and recovery';
      
      voiceService.speak(`Starting ${frequencyName}... for ${purpose}... Put on your headphones... close your eyes... and allow the frequencies to guide your mind... into the desired state... Let yourself relax... completely.`);
      
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

      leftOscillatorRef.current = leftOscillator; // Store both oscillators for cleanup
      rightOscillatorRef.current = rightOscillator;
      setIsPlayingAudio(true);

      toast({
        title: "Binaural Beats Started",
        description: `Playing ${frequencies[currentFrequency].name}`,
      });
    } catch (error) {
      console.error('Error starting binaural beats:', error);
      toast({
        title: "Audio Error",
        description: "Failed to start binaural beats. Please check your audio settings.",
        variant: "destructive",
      });
    }
  };

  const stopBinauralBeats = (showToast = true) => {
    console.log('stopBinauralBeats called with showToast:', showToast);
    try {
      if (leftOscillatorRef.current) {
        leftOscillatorRef.current.stop();
        leftOscillatorRef.current = null;
      }
      if (rightOscillatorRef.current) {
        rightOscillatorRef.current.stop();
        rightOscillatorRef.current = null;
      }
      setIsPlayingAudio(false);
      
      if (showToast) {
        console.log('Showing binaural beats stopped toast');
        toast({
          title: "Binaural Beats Stopped",
          description: "Audio playback has been stopped",
        });
      } else {
        console.log('Skipping binaural beats toast (silent mode)');
      }
    } catch (error) {
      console.error('Error stopping binaural beats:', error);
      setIsPlayingAudio(false); // Force UI update even on error
      if (showToast) {
        toast({
          title: "Audio Stopped",
          description: "Binaural beats stopped (with minor audio cleanup)",
        });
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer(false); // Don't show toast on cleanup
      stopBreathingExercise(false); // Don't show toast on cleanup
      stopBinauralBeats(false); // Don't show toast on cleanup
      stopVoiceGuidance();
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
        <DashboardHeader />
        
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
          {/* Recovery Support Banner */}
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      Your Recovery Journey Matters
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Every day sober is a victory. Track your progress, build healthy habits, and celebrate your strength.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    <Heart className="h-3 w-3 mr-1" />
                    Recovery Focused
                  </Badge>
                  <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                    <Phone className="h-4 w-4 mr-2" />
                    Crisis Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <QuickStats stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TodaysHabits />
            </div>
            <div className="space-y-6">
              <QuickActions 
                onAddHabit={() => setIsHabitModalOpen(true)}
                recoveryDays={stats?.currentStreak || 0}
              />
              <WellnessMetrics />
              <StreakRewards 
                currentStreak={stats?.currentStreak || 0}
                longestStreak={stats?.currentStreak || 0}
                totalHabitsCompleted={stats?.habitsCompletedToday || 0}
              />
            </div>
          </div>

          {/* Recovery-Focused Wellness Tools Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recovery Wellness Tools</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Science-backed techniques to support your recovery journey</p>
              </div>
              <Button 
                variant="ghost" 
                className="text-primary hover:text-blue-700 text-sm font-medium"
                onClick={handleExploreAll}
              >
                View All Tools
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedBiohacks.filter((biohack: any) => 
                // Prioritize recovery-relevant biohacks
                ['Meditation', 'Box Breathing', 'Wim Hof Breathing', 'Cold Exposure Therapy', 'Gratitude Journaling', 'Forest Bathing'].includes(biohack.name)
              ).slice(0, 3).map((biohack: any) => (
                <BiohackCard 
                  key={biohack.id} 
                  biohack={biohack} 
                  onClick={handleBiohackClick}
                />
              ))}
            </div>
          </div>

          <AnalyticsCharts />
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        onClick={() => setIsHabitModalOpen(true)}
      >
        <i className="fas fa-plus text-xl"></i>
      </button>

      <HabitModal 
        isOpen={isHabitModalOpen} 
        onClose={() => setIsHabitModalOpen(false)} 
      />

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
                {selectedBiohack && (selectedBiohack.name === "Binaural Beats" || 
                                    selectedBiohack.name === "Wim Hof Breathing" || 
                                    selectedBiohack.name === "Box Breathing" ||
                                    selectedBiohack.name === "Meditation" || 
                                    selectedBiohack.name === "Red Light Therapy" ||
                                    selectedBiohack.name === "Sauna Therapy" || 
                                    selectedBiohack.name === "Forest Bathing" ||
                                    selectedBiohack.name === "Cold Exposure" || 
                                    selectedBiohack.name === "Ice Bath" ||
                                    selectedBiohack.name === "HIIT Training" ||
                                    selectedBiohack.name === "Blue Light Blocking") && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Interactive Tools
                    </h4>

                    {/* Binaural Beats for specific biohacks */}
                    {selectedBiohack.name === "Binaural Beats" && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium">Frequency:</label>
                          <Select value={currentFrequency} onValueChange={(value: 'focus' | 'relaxation' | 'sleep') => setCurrentFrequency(value)}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="focus">Focus (Alpha - 10Hz)</SelectItem>
                              <SelectItem value="relaxation">Relaxation (Theta - 6Hz)</SelectItem>
                              <SelectItem value="sleep">Sleep (Delta - 4Hz)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Frequency Explanations */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm">
                          {currentFrequency === 'focus' && (
                            <div>
                              <h5 className="font-medium mb-1">Alpha Waves (8-14Hz)</h5>
                              <p className="text-gray-600 dark:text-gray-300">Associated with relaxed focus, creativity, and calm alertness. Ideal for work, study, or meditation.</p>
                            </div>
                          )}
                          {currentFrequency === 'relaxation' && (
                            <div>
                              <h5 className="font-medium mb-1">Theta Waves (4-8Hz)</h5>
                              <p className="text-gray-600 dark:text-gray-300">Linked to deep relaxation, meditation, and creative insight. Often experienced during REM sleep and deep meditation.</p>
                            </div>
                          )}
                          {currentFrequency === 'sleep' && (
                            <div>
                              <h5 className="font-medium mb-1">Delta Waves (0.5-4Hz)</h5>
                              <p className="text-gray-600 dark:text-gray-300">The slowest brainwaves associated with deep, restorative sleep and healing. Delta waves promote physical recovery, immune system strengthening, and memory consolidation.</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={isPlayingAudio ? () => stopBinauralBeats() : startBinauralBeats}
                            variant={isPlayingAudio ? "destructive" : "default"}
                            size="sm"
                            data-testid={isPlayingAudio ? "button-stop-binaural-beats" : "button-start-binaural-beats"}
                          >
                            {isPlayingAudio ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            {isPlayingAudio ? 'Stop Audio' : 'Play Frequency'}
                          </Button>
                        </div>
                        {isPlayingAudio && (
                          <div className="mt-2 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                              🎧 Binaural beats are playing - you should hear audio in both ears
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                              Stereo audio active: {frequencies[currentFrequency].name}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">Use headphones for best effect. Volume is set to safe levels.</p>
                      </div>
                    )}

                    {/* Breathing Timer for Wim Hof and Box Breathing */}
                    {(selectedBiohack.name === "Wim Hof Breathing" || selectedBiohack.name === "Box Breathing") && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-2 animate-pulse">
                            {breathingPhase === 'inhale' && '🫁 Breathe In'}
                            {breathingPhase === 'hold' && '⏸️ Hold'}
                            {breathingPhase === 'exhale' && '💨 Breathe Out'}
                            {breathingPhase === 'pause' && '⏳ Pause'}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cycle: {breathingCount} | Phase: {breathingPhase}
                          </p>
                          {breathingTimerRef.current && (
                            <div className="mt-2 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                                ✨ Breathing exercise is active - follow the visual guide above
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                                Each phase lasts 4 seconds. Continue for as long as comfortable.
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={breathingTimerRef.current ? () => stopBreathingExercise() : startBreathingExercise}
                            variant={breathingTimerRef.current ? "destructive" : "default"}
                            size="sm"
                            data-testid={breathingTimerRef.current ? "button-stop-breathing" : "button-start-breathing"}
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
                              <div className="text-3xl font-bold animate-pulse text-green-600 dark:text-green-400">
                                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                              </div>
                              <Progress 
                                value={timerSeconds > 0 ? ((parseInt(selectedBiohack.timeRequired) * 60 - timerSeconds) / (parseInt(selectedBiohack.timeRequired) * 60)) * 100 : 0} 
                                className="mt-2"
                              />
                              <div className="mt-2 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                                  ⏰ Timer is active - session in progress
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                                  Focus on your practice. The timer will notify you when complete.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            onClick={() => startTimer(5)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                            data-testid="button-timer-5min"
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            5 min
                          </Button>
                          <Button
                            onClick={() => startTimer(10)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                            data-testid="button-timer-10min"
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            10 min
                          </Button>
                          <Button
                            onClick={() => startTimer(20)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                            data-testid="button-timer-20min"
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            20 min
                          </Button>
                          {isTimerRunning && (
                            <Button
                              onClick={() => stopTimer()}
                              variant="destructive"
                              size="sm"
                              data-testid="button-stop-timer"
                            >
                              Stop Timer
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Select a duration to begin your guided session with voice guidance.</p>
                      </div>
                    )}

                    {/* Cold Exposure Timer */}
                    {(selectedBiohack.name === "Cold Exposure" || selectedBiohack.name === "Ice Bath") && (
                      <div className="space-y-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-sm">
                          <h5 className="font-medium mb-2">❄️ Cold Exposure Guidelines</h5>
                          <div className="space-y-1 text-xs">
                            <p><strong>Beginners:</strong> Start with 30 seconds at 15°C (59°F)</p>
                            <p><strong>Intermediate:</strong> Work up to 2 minutes at 10°C (50°F)</p>
                            <p><strong>Advanced:</strong> 3+ minutes at 4°C (39°F) or below</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startTimer(2)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            2 min Cold Timer
                          </Button>
                          {isTimerRunning && (
                            <Button
                              onClick={() => stopTimer()}
                              variant="destructive"
                              size="sm"
                            >
                              Stop Timer
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Always have supervision and exit strategy. Never exceed your limits.</p>
                      </div>
                    )}

                    {/* HIIT Timer */}
                    {selectedBiohack.name === "HIIT Training" && (
                      <div className="space-y-4">
                        <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-lg text-sm">
                          <h5 className="font-medium mb-2">🏃‍♀️ HIIT Session Structure</h5>
                          <div className="space-y-1 text-xs">
                            <p><strong>Warm-up:</strong> 2 minutes light activity</p>
                            <p><strong>Work:</strong> 20 seconds high intensity</p>
                            <p><strong>Rest:</strong> 10 seconds recovery</p>
                            <p><strong>Cycles:</strong> 8 rounds (4 minutes)</p>
                            <p><strong>Cool-down:</strong> 2 minutes stretching</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startTimer(8)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            8 min HIIT
                          </Button>
                          {isTimerRunning && (
                            <Button
                              onClick={() => stopTimer()}
                              variant="destructive"
                              size="sm"
                            >
                              Stop Timer
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">Follow along with the timer for optimal high-intensity intervals.</p>
                      </div>
                    )}

                    {/* Blue Light Blocking Tools */}
                    {selectedBiohack.name === "Blue Light Blocking" && (
                      <div className="space-y-4">
                        <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-lg text-sm">
                          <h5 className="font-medium mb-2">🌅 Blue Light Management Schedule</h5>
                          <div className="space-y-1 text-xs">
                            <p><strong>Morning (6-10 AM):</strong> Get bright natural light exposure</p>
                            <p><strong>Daytime:</strong> Normal screen use with breaks every hour</p>
                            <p><strong>Evening (6 PM):</strong> Reduce screen brightness by 50%</p>
                            <p><strong>Night (8 PM):</strong> Use blue light filters or glasses</p>
                            <p><strong>Bedtime (10 PM):</strong> No screens 1-2 hours before sleep</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => startTimer(60)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                            data-testid="button-timer-screen-break"
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            60 min Screen Break
                          </Button>
                          <Button
                            onClick={() => startTimer(20)}
                            variant="outline"
                            size="sm"
                            disabled={isTimerRunning}
                            data-testid="button-timer-eye-rest"
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            20 min Eye Rest
                          </Button>
                          {isTimerRunning && (
                            <Button
                              onClick={() => stopTimer()}
                              variant="destructive"
                              size="sm"
                              className="col-span-2"
                            >
                              Stop Timer
                            </Button>
                          )}
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm">
                          <h6 className="font-medium mb-1">💡 Quick Tips:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Use f.lux or Night Light on your devices</li>
                            <li>• Position screens 20+ inches from your eyes</li>
                            <li>• Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds</li>
                            <li>• Consider blue light blocking glasses after sunset</li>
                          </ul>
                        </div>
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
                  Back to Dashboard
                </Button>
                
                <Button
                  onClick={handleExploreAll}
                  variant="default"
                  className="flex-1"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  View All Biohacks
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
}
