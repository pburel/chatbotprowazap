import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    message: "Bot successfully handled product inquiry",
    time: "2 min ago",
    type: "Automated Response",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    initials: "SJ",
  },
  {
    id: 2,
    user: "Michael Chen",
    message: "New message template created for support",
    time: "5 min ago",
    type: "Template Update",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    initials: "MC",
  },
  {
    id: 3,
    user: "Emily Rodriguez",
    message: "Bot escalated complex query to human agent",
    time: "12 min ago",
    type: "Escalation",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    initials: "ER",
  },
];

const typeStyles = {
  "Automated Response": "bg-whatsapp-primary/10 text-whatsapp-primary",
  "Template Update": "bg-blue-100 text-blue-800",
  "Escalation": "bg-yellow-100 text-yellow-800",
};

export default function RecentActivity() {
  return (
    <Card className="border-border mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Button variant="ghost" className="text-whatsapp-primary hover:text-whatsapp-secondary">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-accent rounded-lg transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>{activity.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground">{activity.user}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.message}</p>
                <Badge 
                  variant="secondary" 
                  className={`mt-1 ${typeStyles[activity.type as keyof typeof typeStyles]}`}
                >
                  {activity.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
