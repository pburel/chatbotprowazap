import { useState } from "react";
import * as React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageTemplateSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, MessageSquare, Loader2, Eye, Code, User, Calendar, Hash, Phone, Mail } from "lucide-react";
import type { MessageTemplate, InsertMessageTemplate } from "@shared/schema";

const categories = [
  { value: "general", label: "General" },
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "billing", label: "Billing" },
];

const availableVariables = [
  { key: "customer_name", label: "Customer Name", icon: User, sample: "John Smith" },
  { key: "customer_phone", label: "Customer Phone", icon: Phone, sample: "+1 (555) 123-4567" },
  { key: "customer_email", label: "Customer Email", icon: Mail, sample: "john@example.com" },
  { key: "order_id", label: "Order ID", icon: Hash, sample: "#12345" },
  { key: "order_status", label: "Order Status", icon: Code, sample: "Shipped" },
  { key: "date", label: "Current Date", icon: Calendar, sample: "March 15, 2024" },
  { key: "time", label: "Current Time", icon: Calendar, sample: "2:30 PM" },
  { key: "business_name", label: "Business Name", icon: Code, sample: "Your Company" },
];

// Function to replace variables with sample data for preview
const replaceVariables = (content: string): string => {
  let result = content;
  availableVariables.forEach(variable => {
    const regex = new RegExp(`{{\\s*${variable.key}\\s*}}`, 'g');
    result = result.replace(regex, variable.sample);
  });
  return result;
};

// Function to extract variables from content
const extractVariables = (content: string): string[] => {
  const regex = /{{(\s*\w+\s*)}}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1].trim());
  }
  return Array.from(new Set(matches)); // Remove duplicates
};

export default function TemplateEditor() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery<MessageTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const form = useForm<InsertMessageTemplate>({
    resolver: zodResolver(insertMessageTemplateSchema),
    defaultValues: {
      name: "",
      content: "",
      keywords: [],
      category: "general",
      isActive: true,
    },
  });

  // Watch content changes for live preview
  const watchedContent = form.watch("content");

  // Update preview when content changes
  React.useEffect(() => {
    setPreviewContent(replaceVariables(watchedContent || ""));
  }, [watchedContent]);

  const createTemplateMutation = useMutation({
    mutationFn: (data: InsertMessageTemplate) => apiRequest("POST", "/api/templates", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Template Created",
        description: "Message template has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create template.",
        variant: "destructive",
      });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MessageTemplate> }) => 
      apiRequest("PUT", `/api/templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      form.reset();
      toast({
        title: "Template Updated",
        description: "Message template has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update template.",
        variant: "destructive",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Template Deleted",
        description: "Message template has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete template.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMessageTemplate) => {
    // Parse keywords from comma-separated string
    const keywordsArray = typeof data.keywords === 'string' 
      ? (data.keywords as string).split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0)
      : data.keywords || [];

    const templateData = { ...data, keywords: keywordsArray };

    if (editingTemplate) {
      updateTemplateMutation.mutate({ id: editingTemplate.id, data: templateData });
    } else {
      createTemplateMutation.mutate(templateData);
    }
  };

  const handleEdit = (template: MessageTemplate) => {
    setEditingTemplate(template);
    form.reset({
      name: template.name,
      content: template.content,
      keywords: template.keywords || [],
      category: template.category || "general",
      isActive: template.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplateMutation.mutate(id);
    }
  };

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    form.reset();
    setPreviewContent("");
    setIsDialogOpen(true);
  };

  const insertVariable = (variableKey: string) => {
    const currentContent = form.getValues("content") || "";
    const cursorPosition = (document.activeElement as HTMLTextAreaElement)?.selectionStart || currentContent.length;
    const variable = `{{${variableKey}}}`;
    const newContent = currentContent.slice(0, cursorPosition) + variable + currentContent.slice(cursorPosition);
    form.setValue("content", newContent);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Templates</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewTemplate} className="bg-whatsapp-primary hover:bg-whatsapp-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Edit Template" : "Create New Template"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Order Status" data-testid="input-template-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "general"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-template-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Template Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Live Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-4">
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message Content</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  rows={8}
                                  placeholder="Enter your message template with variables like {{customer_name}}..."
                                  data-testid="textarea-template-content"
                                  className="font-mono"
                                />
                              </FormControl>
                              <FormMessage />
                              {watchedContent && (
                                <div className="text-xs text-muted-foreground">
                                  Variables used: {extractVariables(watchedContent).join(", ") || "None"}
                                </div>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="keywords"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trigger Keywords</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  value={Array.isArray(field.value) ? field.value.join(', ') : (field.value || '')}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  placeholder="order, status, track (comma separated)"
                                  data-testid="input-template-keywords"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Available Variables</h4>
                          <div className="space-y-1 max-h-72 overflow-y-auto">
                            {availableVariables.map((variable) => {
                              const IconComponent = variable.icon;
                              return (
                                <Button
                                  key={variable.key}
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start text-xs"
                                  onClick={() => insertVariable(variable.key)}
                                  data-testid={`button-insert-${variable.key}`}
                                >
                                  <IconComponent className="h-3 w-3 mr-2" />
                                  {variable.label}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-muted rounded-lg">
                          <h5 className="text-xs font-medium mb-1">How to use variables:</h5>
                          <p className="text-xs text-muted-foreground">
                            Click any variable above to insert it, or manually type <code>{"{{variable_name}}"}</code> in your message.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Live Preview</h4>
                        <div className="border rounded-lg p-4 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm max-w-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-whatsapp-primary rounded-full flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-sm font-medium">Your Bot</span>
                            </div>
                            <div className="text-sm">
                              {previewContent || "Your message preview will appear here..."}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Sample Data Used:</h5>
                          <div className="space-y-1 text-xs">
                            {availableVariables.map((variable) => (
                              <div key={variable.key} className="flex justify-between">
                                <span className="text-muted-foreground">{`{{${variable.key}}}:`}</span>
                                <span>{variable.sample}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-2">Template Analytics:</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Character count:</span>
                              <span>{previewContent.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Variables used:</span>
                              <span>{extractVariables(watchedContent || "").length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Estimated reading time:</span>
                              <span>{Math.max(1, Math.ceil(previewContent.split(' ').length / 200))}s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel-template"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
                    className="bg-whatsapp-primary hover:bg-whatsapp-secondary"
                    data-testid="button-save-template"
                  >
                    {(createTemplateMutation.isPending || updateTemplateMutation.isPending) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {editingTemplate ? "Update" : "Create"} Template
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {templates?.map((template) => (
          <Card key={template.id} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-foreground">{template.name}</h4>
                    <Badge variant="secondary">
                      {categories.find(c => c.value === template.category)?.label || template.category}
                    </Badge>
                    {template.isActive && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Keywords: {template.keywords?.join(', ') || 'None'}</span>
                      <span>Used {template.usageCount || 0} times</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!templates || templates.length === 0) && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first message template to get started</p>
            <Button onClick={handleNewTemplate} className="bg-whatsapp-primary hover:bg-whatsapp-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
