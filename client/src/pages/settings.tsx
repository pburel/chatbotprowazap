import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Database, 
  Settings as SettingsIcon, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Bell,
  Shield,
  Globe,
  Clock
} from "lucide-react";

interface DatabaseStatus {
  connected: boolean;
  type: string;
  lastChecked: Date;
  error?: string;
}

interface AppSettings {
  notifications: boolean;
  autoSave: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
  apiTimeout: number;
}

export default function Settings() {
  const { toast } = useToast();
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    connected: false,
    type: "In-Memory",
    lastChecked: new Date()
  });

  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoSave: true,
    darkMode: false,
    language: "en",
    timezone: "UTC",
    apiTimeout: 30000
  });

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      
      setDbStatus({
        connected: data.database?.connected || false,
        type: data.database?.type || "In-Memory",
        lastChecked: new Date(),
        error: data.database?.error
      });
    } catch (error) {
      setDbStatus({
        connected: false,
        type: "Unknown",
        lastChecked: new Date(),
        error: "Failed to check database status"
      });
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
    const interval = setInterval(checkDatabaseStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key} has been updated successfully.`,
    });
  };

  const testDatabaseConnection = async () => {
    toast({
      title: "Testing Connection",
      description: "Checking database connection...",
    });
    
    await checkDatabaseStatus();
    
    toast({
      title: dbStatus.connected ? "Connection Successful" : "Connection Failed",
      description: dbStatus.connected 
        ? `Connected to ${dbStatus.type} database` 
        : dbStatus.error || "Unable to connect to database",
      variant: dbStatus.connected ? "default" : "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <SettingsIcon className="h-8 w-8 text-whatsapp-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">Manage your application settings and configuration</p>
        </div>
      </div>

      {/* Database Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Status</span>
          </CardTitle>
          <CardDescription>
            Current database connection and storage information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {dbStatus.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">
                  {dbStatus.connected ? "Connected" : "Disconnected"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Database Type: {dbStatus.type}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={dbStatus.connected ? "default" : "destructive"}>
                {dbStatus.connected ? "Online" : "Offline"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={testDatabaseConnection}
                className="flex items-center space-x-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Test Connection</span>
              </Button>
            </div>
          </div>

          {dbStatus.error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                <strong>Error:</strong> {dbStatus.error}
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Last checked: {dbStatus.lastChecked.toLocaleString()}
          </div>

          {dbStatus.type === "In-Memory" && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                <strong>Note:</strong> Using temporary in-memory storage. Data will be lost when the application restarts. 
                Configure a DATABASE_URL to enable persistent storage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5" />
            <span>Application Settings</span>
          </CardTitle>
          <CardDescription>
            Configure your application preferences and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="notifications" className="text-base font-medium">
                  Enable Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for new messages and system events
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
            />
          </div>

          <Separator />

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="autoSave" className="text-base font-medium">
                  Auto-Save Changes
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save configuration changes
                </p>
              </div>
            </div>
            <Switch
              id="autoSave"
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
            />
          </div>

          <Separator />

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="language" className="text-base font-medium">
                  Language
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred interface language
                </p>
              </div>
            </div>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <Separator />

          {/* Timezone */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="timezone" className="text-base font-medium">
                  Timezone
                </Label>
                <p className="text-sm text-muted-foreground">
                  Set your local timezone for accurate timestamps
                </p>
              </div>
            </div>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>

          <Separator />

          {/* API Timeout */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="apiTimeout" className="text-base font-medium">
                  API Timeout (seconds)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Maximum time to wait for API responses
                </p>
              </div>
            </div>
            <Input
              id="apiTimeout"
              type="number"
              min="5"
              max="120"
              value={settings.apiTimeout / 1000}
              onChange={(e) => handleSettingChange("apiTimeout", parseInt(e.target.value) * 1000)}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Application version and environment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Application Version:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Environment:</span>
            <span className="font-medium">Development</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Database Type:</span>
            <span className="font-medium">{dbStatus.type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}