import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Conversations from "@/pages/conversations";
import BotConfig from "@/pages/bot-config";
import Templates from "@/pages/templates";
import Automation from "@/pages/automation";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-0">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/conversations" component={Conversations} />
            <Route path="/bot-config" component={BotConfig} />
            <Route path="/templates" component={Templates} />
            <Route path="/automation" component={Automation} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
