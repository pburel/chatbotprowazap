import { Card } from "@/components/ui/card";
import TemplateEditor from "@/components/templates/template-editor";

export default function Templates() {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Message Templates</h2>
        <p className="text-muted-foreground">Create and manage automated response templates</p>
      </div>

      <TemplateEditor />
    </div>
  );
}
