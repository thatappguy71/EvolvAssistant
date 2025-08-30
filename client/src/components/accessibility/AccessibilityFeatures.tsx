import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Volume2, 
  Type, 
  Palette, 
  MousePointer,
  Accessibility,
  Zap,
  Heart
} from "lucide-react";

export default function AccessibilityFeatures() {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    voiceGuidance: true,
    screenReader: false,
    colorBlindSupport: false,
    fontSize: 16,
    voiceSpeed: 1.0,
    colorTheme: "default"
  });

  const fontSizes = [
    { value: 14, label: "Small" },
    { value: 16, label: "Default" },
    { value: 18, label: "Large" },
    { value: 20, label: "Extra Large" },
    { value: 24, label: "Accessibility" }
  ];

  const colorThemes = [
    { value: "default", label: "Default", description: "Standard green and blue theme" },
    { value: "high-contrast", label: "High Contrast", description: "Black and white with yellow accents" },
    { value: "colorblind", label: "Colorblind Friendly", description: "Blue and orange theme" },
    { value: "low-vision", label: "Low Vision", description: "High contrast with large elements" }
  ];

  const accessibilityFeatures = [
    {
      id: "highContrast",
      title: "High Contrast Mode",
      description: "Increase contrast for better visibility",
      icon: Eye,
      category: "vision"
    },
    {
      id: "largeText",
      title: "Large Text",
      description: "Increase text size throughout the app",
      icon: Type,
      category: "vision"
    },
    {
      id: "reducedMotion",
      title: "Reduced Motion",
      description: "Minimize animations and transitions",
      icon: Zap,
      category: "motion"
    },
    {
      id: "voiceGuidance",
      title: "Voice Guidance",
      description: "Audio guidance for biohacks and exercises",
      icon: Volume2,
      category: "audio"
    },
    {
      id: "screenReader",
      title: "Screen Reader Optimization",
      description: "Enhanced support for screen readers",
      icon: Accessibility,
      category: "assistive"
    },
    {
      id: "colorBlindSupport",
      title: "Color Blind Support",
      description: "Alternative color schemes and patterns",
      icon: Palette,
      category: "vision"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vision": return "bg-blue-100 text-blue-800";
      case "audio": return "bg-green-100 text-green-800";
      case "motion": return "bg-purple-100 text-purple-800";
      case "assistive": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-blue-600" />
            Accessibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Recovery for Everyone</span>
            </div>
            <p className="text-sm text-blue-700">
              Evolv is designed to be accessible to all users, regardless of abilities. 
              Customize these settings to make your recovery journey as comfortable as possible.
            </p>
          </div>

          {/* Accessibility Toggles */}
          <div className="space-y-4">
            <h4 className="font-medium">Accessibility Features</h4>
            {accessibilityFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label className="font-medium">{feature.title}</Label>
                        <Badge className={getCategoryColor(feature.category)}>
                          {feature.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[feature.id as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, [feature.id]: checked }))
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* Font Size Control */}
          <div className="space-y-3">
            <Label className="font-medium">Font Size</Label>
            <div className="space-y-2">
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, fontSize: value[0] }))}
                min={14}
                max={24}
                step={2}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Small (14px)</span>
                <span className="font-medium">Current: {settings.fontSize}px</span>
                <span>Large (24px)</span>
              </div>
            </div>
          </div>

          {/* Voice Speed Control */}
          {settings.voiceGuidance && (
            <div className="space-y-3">
              <Label className="font-medium">Voice Guidance Speed</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.voiceSpeed]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, voiceSpeed: value[0] }))}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Slow (0.5x)</span>
                  <span className="font-medium">Current: {settings.voiceSpeed}x</span>
                  <span>Fast (2.0x)</span>
                </div>
              </div>
            </div>
          )}

          {/* Color Theme Selection */}
          <div className="space-y-3">
            <Label className="font-medium">Color Theme</Label>
            <Select 
              value={settings.colorTheme} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, colorTheme: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorThemes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    <div>
                      <div className="font-medium">{theme.label}</div>
                      <div className="text-xs text-muted-foreground">{theme.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Apply Settings */}
          <div className="pt-4 border-t">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Accessibility className="h-4 w-4 mr-2" />
              Apply Accessibility Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}