import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Shield, Heart, Target, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OnboardingData {
  recoveryType: string;
  sobrietyDate: Date | null;
  primaryGoals: string[];
  supportSystem: string[];
  triggerAwareness: string;
  preferredReminders: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    recoveryType: "",
    sobrietyDate: null,
    primaryGoals: [],
    supportSystem: [],
    triggerAwareness: "",
    preferredReminders: ""
  });

  const steps = [
    {
      title: "Welcome to Your Recovery Journey",
      subtitle: "Let's personalize Evolv for your unique path to wellness",
      icon: Shield
    },
    {
      title: "Recovery Focus",
      subtitle: "Help us understand your recovery journey",
      icon: Heart
    },
    {
      title: "Your Goals",
      subtitle: "What do you want to achieve with Evolv?",
      icon: Target
    },
    {
      title: "Support System",
      subtitle: "Building your network of support",
      icon: CheckCircle
    }
  ];

  const recoveryTypes = [
    { value: "alcohol", label: "Alcohol Recovery" },
    { value: "drugs", label: "Drug Recovery" },
    { value: "both", label: "Alcohol & Drug Recovery" },
    { value: "behavioral", label: "Behavioral Addiction" },
    { value: "support", label: "Supporting Someone in Recovery" },
    { value: "general", label: "General Wellness" }
  ];

  const goalOptions = [
    "Maintain sobriety",
    "Build healthy habits",
    "Improve mental health",
    "Strengthen relationships",
    "Manage stress and anxiety",
    "Improve physical health",
    "Find purpose and meaning",
    "Build financial stability"
  ];

  const supportOptions = [
    "Sponsor/Mentor",
    "Therapist/Counselor", 
    "Support Group (AA/NA/SMART)",
    "Family Members",
    "Close Friends",
    "Recovery Coach",
    "Medical Team",
    "Online Community"
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const toggleSupport = (support: string) => {
    setData(prev => ({
      ...prev,
      supportSystem: prev.supportSystem.includes(support)
        ? prev.supportSystem.filter(s => s !== support)
        : [...prev.supportSystem, support]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.recoveryType !== "";
      case 2: return data.primaryGoals.length > 0;
      case 3: return data.supportSystem.length > 0;
      default: return true;
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <StepIcon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <p className="text-muted-foreground">{steps[currentStep].subtitle}</p>
          
          <div className="mt-4">
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <p className="text-lg">
                Evolv is designed to support your recovery journey with evidence-based tools, 
                crisis resources, and personalized wellness tracking.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Recovery Safe</h3>
                  <p className="text-sm text-muted-foreground">All content is reviewed for recovery safety</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Crisis Support</h3>
                  <p className="text-sm text-muted-foreground">24/7 access to crisis resources</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Personalized</h3>
                  <p className="text-sm text-muted-foreground">Tailored to your recovery needs</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Recovery Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">What brings you to Evolv?</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  This helps us provide the most relevant content and resources
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recoveryTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setData(prev => ({ ...prev, recoveryType: type.value }))}
                    className={`p-4 text-left border-2 rounded-lg transition-all ${
                      data.recoveryType === type.value
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>

              {data.recoveryType && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4 text-green-600" />
                    <Label className="font-medium">Sobriety Date (Optional)</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Track your progress from your sobriety start date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !data.sobrietyDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {data.sobrietyDate ? format(data.sobrietyDate, "PPP") : "Select your sobriety date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={data.sobrietyDate || undefined}
                        onSelect={(date) => setData(prev => ({ ...prev, sobrietyDate: date || null }))}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Goals */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">What are your primary goals?</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Select all that apply - we'll customize your experience accordingly
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 text-left border-2 rounded-lg transition-all ${
                      data.primaryGoals.includes(goal)
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal}</span>
                      {data.primaryGoals.includes(goal) && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Label htmlFor="triggerAwareness" className="text-base font-medium">
                  What are your biggest challenges? (Optional)
                </Label>
                <Textarea
                  id="triggerAwareness"
                  placeholder="e.g., stress, social situations, certain times of day..."
                  value={data.triggerAwareness}
                  onChange={(e) => setData(prev => ({ ...prev, triggerAwareness: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Step 3: Support System */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Who's in your support network?</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll help you stay connected with your support system
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {supportOptions.map((support) => (
                  <button
                    key={support}
                    onClick={() => toggleSupport(support)}
                    className={`p-3 text-left border-2 rounded-lg transition-all ${
                      data.supportSystem.includes(support)
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{support}</span>
                      {data.supportSystem.includes(support) && (
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Label htmlFor="reminders" className="text-base font-medium">
                  How often would you like recovery check-ins?
                </Label>
                <Select 
                  value={data.preferredReminders} 
                  onValueChange={(value) => setData(prev => ({ ...prev, preferredReminders: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose reminder frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No reminders</SelectItem>
                    <SelectItem value="daily">Daily check-ins</SelectItem>
                    <SelectItem value="twice-daily">Morning & evening</SelectItem>
                    <SelectItem value="weekly">Weekly progress review</SelectItem>
                    <SelectItem value="custom">Custom schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
                Skip Setup
              </Button>
            </div>
            
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}