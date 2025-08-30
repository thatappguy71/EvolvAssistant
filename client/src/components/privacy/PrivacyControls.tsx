import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Eye, Download, Trash2, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PrivacyControls() {
  const { toast } = useToast();
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    crashReporting: true,
    analytics: false,
    locationTracking: false,
    healthDataSharing: false,
    marketingCommunications: false
  });

  const handleExportData = () => {
    // Simulate data export
    toast({
      title: "Data Export Started",
      description: "Your data will be emailed to you within 24 hours in JSON format.",
    });
  };

  const handleDeleteData = () => {
    toast({
      title: "Data Deletion Requested",
      description: "Your account and all data will be permanently deleted within 30 days.",
      variant: "destructive",
    });
  };

  const privacyControls = [
    {
      id: "dataCollection",
      title: "Essential Data Collection",
      description: "Basic app functionality and habit tracking",
      required: true,
      category: "essential"
    },
    {
      id: "crashReporting",
      title: "Crash Reporting",
      description: "Help us fix bugs and improve stability",
      required: false,
      category: "improvement"
    },
    {
      id: "analytics",
      title: "Usage Analytics",
      description: "Anonymous usage patterns to improve features",
      required: false,
      category: "improvement"
    },
    {
      id: "locationTracking",
      title: "Location Services",
      description: "Find nearby meetings and treatment centers",
      required: false,
      category: "features"
    },
    {
      id: "healthDataSharing",
      title: "Health Data Integration",
      description: "Sync with Apple Health or Google Fit",
      required: false,
      category: "features"
    },
    {
      id: "marketingCommunications",
      title: "Marketing Communications",
      description: "Recovery tips and app updates via email",
      required: false,
      category: "marketing"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "essential": return "bg-green-100 text-green-800";
      case "improvement": return "bg-blue-100 text-blue-800";
      case "features": return "bg-purple-100 text-purple-800";
      case "marketing": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Privacy & Data Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Your Recovery Data is Private</span>
            </div>
            <p className="text-sm text-green-700">
              We never share your recovery information with third parties. Your sobriety data, 
              crisis contacts, and personal wellness metrics remain completely confidential.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Data Collection Preferences</h4>
            {privacyControls.map((control) => (
              <div key={control.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="font-medium">{control.title}</Label>
                    <Badge className={getCategoryColor(control.category)}>
                      {control.category}
                    </Badge>
                    {control.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{control.description}</p>
                </div>
                <Switch
                  checked={privacySettings[control.id as keyof typeof privacySettings]}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, [control.id]: checked }))
                  }
                  disabled={control.required}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export My Data
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Delete Account & Data
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account, recovery progress, habits, and all associated data. 
                    This action cannot be undone.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">
                      <strong>Important:</strong> Consider exporting your data first if you want to keep 
                      a record of your recovery progress.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteData} className="flex-1">
                      Yes, Delete Everything
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}