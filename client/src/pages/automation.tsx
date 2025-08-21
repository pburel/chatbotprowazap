import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Plus, Clock, MessageSquare, Users, Zap } from "lucide-react";

const automationRules = [
  {
    id: 1,
    name: "Business Hours Auto-Reply",
    description: "Send automatic responses outside business hours",
    trigger: "Outside business hours",
    action: "Send business hours message",
    isActive: true,
    category: "scheduling",
  },
  {
    id: 2,
    name: "Welcome New Customers",
    description: "Greet first-time customers with welcome message",
    trigger: "First message from new number",
    action: "Send welcome template",
    isActive: true,
    category: "engagement",
  },
  {
    id: 3,
    name: "Escalate Complex Queries",
    description: "Forward unresolved queries to human agents",
    trigger: "Bot confidence < 70%",
    action: "Transfer to agent",
    isActive: false,
    category: "escalation",
  },
  {
    id: 4,
    name: "Order Status Automation",
    description: "Automatically handle order status inquiries",
    trigger: "Keywords: order, status, track",
    action: "Query order database",
    isActive: true,
    category: "orders",
  },
];

const categoryStyles = {
  scheduling: "bg-blue-100 text-blue-800",
  engagement: "bg-green-100 text-green-800",
  escalation: "bg-yellow-100 text-yellow-800",
  orders: "bg-purple-100 text-purple-800",
};

const categoryIcons = {
  scheduling: Clock,
  engagement: Users,
  escalation: Zap,
  orders: MessageSquare,
};

export default function Automation() {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Automation Rules</h2>
        <p className="text-muted-foreground">Set up automated workflows and responses for your chatbot</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-whatsapp-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-whatsapp-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">Total Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">142</p>
                <p className="text-sm text-muted-foreground">Triggered Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Automation Rules</h3>
        <Button className="bg-whatsapp-primary hover:bg-whatsapp-secondary">
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {automationRules.map((rule) => {
          const CategoryIcon = categoryIcons[rule.category as keyof typeof categoryIcons];
          
          return (
            <Card key={rule.id} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <CategoryIcon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-foreground">{rule.name}</h4>
                        <Badge className={categoryStyles[rule.category as keyof typeof categoryStyles]}>
                          {rule.category.charAt(0).toUpperCase() + rule.category.slice(1)}
                        </Badge>
                        {rule.isActive && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {rule.description}
                      </p>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p><span className="font-medium">Trigger:</span> {rule.trigger}</p>
                        <p><span className="font-medium">Action:</span> {rule.action}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Switch checked={rule.isActive} />
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {automationRules.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No automation rules</h3>
            <p className="text-muted-foreground mb-4">Create your first automation rule to get started</p>
            <Button className="bg-whatsapp-primary hover:bg-whatsapp-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
