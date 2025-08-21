import { Card } from "@/components/ui/card";
import ConfigForm from "@/components/bot-config/config-form";

export default function BotConfig() {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Bot Configuration</h2>
        <p className="text-muted-foreground">Configure your chatbot settings and behavior</p>
      </div>

      <Card className="max-w-2xl">
        <ConfigForm />
      </Card>
    </div>
  );
}
