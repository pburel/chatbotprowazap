import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  MessageSquare, 
  Bot, 
  FileText, 
  Settings, 
  TrendingUp,
  MessageCircle,
  Cog,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Conversations", href: "/conversations", icon: MessageSquare },
  { name: "Bot Configuration", href: "/bot-config", icon: Bot },
  { name: "Message Templates", href: "/templates", icon: FileText },
  { name: "Automation", href: "/automation", icon: Settings },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Cog },
];

// Sidebar Content Component - Reused for both desktop and mobile
function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-whatsapp-primary rounded-full flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ChatBot Manager</h1>
            <p className="text-sm text-muted-foreground">WhatsApp Business</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors cursor-pointer touch-manipulation",
                    isActive
                      ? "bg-whatsapp-primary/10 text-whatsapp-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80"
                  )}
                  onClick={onItemClick}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-foreground">John Smith</p>
            <p className="text-sm text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Header Component
function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-white dark:bg-card">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-whatsapp-primary rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-foreground">ChatBot Manager</h1>
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2" data-testid="button-mobile-menu">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-white dark:bg-card shadow-lg border-r border-border">
        <SidebarContent />
      </div>
    </>
  );
}
