import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, MessageSquare, Users, MapPin } from "lucide-react";

export default function MobilePanicButton() {
  const [isOpen, setIsOpen] = useState(false);

  const crisisResources = [
    {
      name: "Crisis Text Line",
      action: "Text HOME to 741741",
      icon: MessageSquare,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "Suicide Prevention Lifeline", 
      action: "Call 988",
      icon: Phone,
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      name: "SAMHSA Helpline",
      action: "Call 1-800-662-4357", 
      icon: Phone,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      name: "Find Local Meeting",
      action: "Open meeting finder",
      icon: MapPin,
      color: "bg-green-600 hover:bg-green-700"
    }
  ];

  const handleCrisisAction = (action: string) => {
    if (action.includes("Text")) {
      // Open SMS app
      window.open("sms:741741?body=HOME");
    } else if (action.includes("Call")) {
      // Extract phone number and open phone app
      const phoneNumber = action.match(/[\d-]+/)?.[0];
      if (phoneNumber) {
        window.open(`tel:${phoneNumber}`);
      }
    } else if (action.includes("meeting")) {
      // Navigate to meeting finder
      window.location.href = "/recovery?action=meetings";
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Panic Button */}
      <Button
        className="fixed bottom-24 left-4 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg z-50 flex items-center justify-center animate-pulse"
        onClick={() => setIsOpen(true)}
      >
        <Phone className="h-8 w-8" />
      </Button>

      {/* Crisis Resources Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">
              Crisis Support Resources
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600 mb-4">
              You're not alone. Help is available 24/7.
            </div>
            
            {crisisResources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <Button
                  key={index}
                  className={`w-full justify-start text-white ${resource.color}`}
                  onClick={() => handleCrisisAction(resource.action)}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{resource.name}</div>
                    <div className="text-xs opacity-90">{resource.action}</div>
                  </div>
                </Button>
              );
            })}
            
            <div className="text-center text-xs text-gray-500 mt-4">
              If you're in immediate danger, call 911
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}