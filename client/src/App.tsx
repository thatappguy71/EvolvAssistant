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
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/habits" component={Habits} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/biohacks" component={Biohacks} />
          <Route path="/ai-recommendations" component={AIRecommendations} />
          <Route path="/wellness" component={Wellness} />
          <Route path="/premium" component={Premium} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/payment-test" component={PaymentTest} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
        </>
      )}
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
