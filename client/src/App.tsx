import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/components/Sidebar";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Habits from "@/pages/habits";
import Analytics from "@/pages/analytics";
import Biohacks from "@/pages/biohacks";
import AIRecommendations from "@/pages/ai-recommendations";
import Wellness from "@/pages/wellness";
import Premium from "@/pages/premium";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Pricing from "@/pages/pricing";
import PaymentTest from "@/pages/payment-test";
import DirectPayment from "@/pages/direct-payment";
import BetaFeedback from "@/pages/BetaFeedback";
import NotFound from "@/pages/not-found";
import ColorDemo from "@/components/ColorDemo";

function Router() {
  return (
    <Switch>
      {/* Landing page still available for first-time visitors */}
      <Route path="/landing" component={Landing} />
      
      {/* All app features now accessible without authentication for beta testing */}
      <Route path="/" component={Dashboard} />
      <Route path="/habits" component={Habits} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/biohacks" component={Biohacks} />
      <Route path="/ai-recommendations" component={AIRecommendations} />
      <Route path="/wellness" component={Wellness} />
      <Route path="/premium" component={Premium} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/payment-test" component={PaymentTest} />
      <Route path="/direct-payment" component={DirectPayment} />
      <Route path="/color-demo" component={ColorDemo} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/beta-feedback" component={BetaFeedback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="evolv-ui-theme">
        <SidebarProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </NotificationProvider>
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
