import { useQuery } from "@tanstack/react-query";
import StatsCards from "@/components/dashboard/stats-cards";
import MessageChart from "@/components/dashboard/message-chart";
import PerformanceMetrics from "@/components/dashboard/performance-metrics";
import RecentActivity from "@/components/dashboard/recent-activity";
import ChatSimulator from "@/components/chat/chat-simulator";

export default function Dashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row">
      {/* Left Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your WhatsApp chatbot performance and manage conversations</p>
        </div>

        {/* Stats Cards */}
        <StatsCards analytics={analytics} />

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MessageChart />
          <PerformanceMetrics analytics={analytics} />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>

      {/* Right Sidebar - Chat Simulator */}
      <div className="w-full lg:w-96">
        <ChatSimulator />
      </div>
    </div>
  );
}
