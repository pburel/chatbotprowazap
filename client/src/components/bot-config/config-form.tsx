import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBotConfigSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Loader2, Save } from "lucide-react";
import type { BotConfig, InsertBotConfig } from "@shared/schema";

export default function ConfigForm() {
  const { toast } = useToast();
  
  const { data: botConfig, isLoading } = useQuery<BotConfig>({
    queryKey: ["/api/bot-config"],
  });

  const form = useForm<InsertBotConfig>({
    resolver: zodResolver(insertBotConfigSchema),
    defaultValues: {
      name: botConfig?.name || "Customer Support Bot",
      welcomeMessage: botConfig?.welcomeMessage || "Hello! I'm your virtual assistant. How can I help you today?",
      isActive: botConfig?.isActive ?? true,
      autoRespond: botConfig?.autoRespond ?? true,
      responseDelay: botConfig?.responseDelay || 1000,
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: (data: InsertBotConfig) => apiRequest("PUT", "/api/bot-config", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot-config"] });
      toast({
        title: "Configuration Updated",
        description: "Bot configuration has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bot configuration.",
        variant: "destructive",
      });
    },
  });

  // Update form values when data loads
  if (botConfig && !form.formState.isDirty) {
    form.reset({
      name: botConfig.name,
      welcomeMessage: botConfig.welcomeMessage,
      isActive: botConfig.isActive,
      autoRespond: botConfig.autoRespond,
      responseDelay: botConfig.responseDelay,
    });
  }

  const onSubmit = (data: InsertBotConfig) => {
    updateConfigMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  The name displayed for your chatbot
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="welcomeMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Welcome Message</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={3}
                    placeholder="Enter the welcome message for new conversations"
                  />
                </FormControl>
                <FormDescription>
                  This message will be sent when a customer starts a new conversation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Bot</FormLabel>
                  <FormDescription>
                    Turn the chatbot on or off
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoRespond"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Auto-respond to messages</FormLabel>
                  <FormDescription>
                    Automatically respond to incoming messages
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responseDelay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Response Delay (ms)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0}
                    max={10000}
                    step={100}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Delay before sending automated responses (in milliseconds)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={updateConfigMutation.isPending}
              className="bg-whatsapp-primary hover:bg-whatsapp-secondary"
            >
              {updateConfigMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </form>
    </Form>
  );
}
