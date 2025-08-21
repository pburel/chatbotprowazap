import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, Bot, Percent } from "lucide-react";
import type { Analytics } from "@shared/schema";

interface StatsCardsProps {
  analytics?: Analytics;
}

export default function StatsCards({ analytics }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Messages",
      value: analytics?.totalMessages?.toLocaleString() || "0",
      change: "+12.5%",
      icon: MessageSquare,
      color: "text-whatsapp-primary",
      bgColor: "bg-whatsapp-primary/10",
    },
    {
      title: "Active Users",
      value: analytics?.activeUsers?.toLocaleString() || "0",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Bot Responses",
      value: analytics?.botResponses?.toLocaleString() || "0",
      change: "+15.3%",
      icon: Bot,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Response Rate",
      value: `${analytics?.responseRate || 0}%`,
      change: "-2.1%",
      icon: Percent,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      negative: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.negative
                    ? "text-red-600 bg-red-100"
                    : "text-green-600 bg-green-100"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
