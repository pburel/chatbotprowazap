import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Analytics } from "@shared/schema";

interface PerformanceMetricsProps {
  analytics?: Analytics;
}

export default function PerformanceMetrics({ analytics }: PerformanceMetricsProps) {
  const metrics = [
    {
      label: "Average Response Time",
      value: `${((analytics?.avgResponseTime || 1200) / 1000).toFixed(1)}s`,
      progress: 85,
      color: "bg-whatsapp-primary",
    },
    {
      label: "Bot Accuracy",
      value: `${analytics?.responseRate || 92}%`,
      progress: analytics?.responseRate || 92,
      color: "bg-blue-500",
    },
    {
      label: "User Satisfaction",
      value: `${((analytics?.userSatisfaction || 48) / 10).toFixed(1)}/5`,
      progress: ((analytics?.userSatisfaction || 48) / 50) * 100,
      color: "bg-yellow-500",
    },
  ];

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Response Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <span className="font-semibold text-foreground">{metric.value}</span>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
