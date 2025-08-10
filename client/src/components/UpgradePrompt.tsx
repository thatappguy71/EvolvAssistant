import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";

interface UpgradePromptProps {
  title: string;
  description: string;
  currentCount?: number;
  maxAllowed?: number;
  onDismiss?: () => void;
}

export default function UpgradePrompt({ 
  title, 
  description, 
  currentCount, 
  maxAllowed,
  onDismiss 
}: UpgradePromptProps) {
  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-emerald-800 dark:text-emerald-200">{title}</CardTitle>
              <CardDescription className="text-emerald-600 dark:text-emerald-300 mt-1">
                {description}
              </CardDescription>
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              ×
            </Button>
          )}
        </div>
        
        {currentCount !== undefined && maxAllowed !== undefined && (
          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Current usage</span>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                {currentCount}/{maxAllowed === -1 ? '∞' : maxAllowed}
              </Badge>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Free Plan</h4>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  15 habits maximum
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Basic AI recommendations
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Premium Plan</h4>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Unlimited habits
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Advanced AI recommendations
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Detailed analytics
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Health app integration
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-emerald-200 dark:border-emerald-700">
            <Link href="/pricing" className="flex-1">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                View Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/premium" className="flex-1">
              <Button variant="outline" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                Upgrade Now
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Start your free trial • Cancel anytime • No hidden fees
          </p>
        </div>
      </CardContent>
    </Card>
  );
}