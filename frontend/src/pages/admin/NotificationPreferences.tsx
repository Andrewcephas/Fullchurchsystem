import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  MessageSquare,
  Bell,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationPreference {
  id: string;
  user_id: string;
  branch_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  push_enabled: boolean;
  phone_number: string | null;
  email_address: string | null;
  whatsapp_number: string | null;
  notify_events: boolean;
  notify_meetings: boolean;
  notify_announcements: boolean;
  notify_prayer_requests: boolean;
  notify_finance_updates: boolean;
  notify_attendance: boolean;
}

const NotificationPreferences = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<NotificationPreference>>({});
  const [hasChanges, setHasChanges] = useState(false);

   // Fetch current user's preferences
   const { data: preferences, isLoading } = useQuery({
     queryKey: ["notification-preferences"],
     queryFn: async () => {
       const response = await apiService.getNotificationPreferences();
       return response.data || null;
     },
   });

   // Update preferences mutation
   const updateMutation = useMutation({
     mutationFn: async (data: Partial<NotificationPreference>) => {
       const response = await apiService.updateNotificationPreferences(data);
       if (response.error) throw new Error(response.error);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
       setHasChanges(false);
       toast({
         title: "Success",
         description: "Notification preferences updated",
       });
     },
     onError: () => {
       toast({
         title: "Error",
         description: "Failed to update preferences",
         variant: "destructive",
       });
     },
   });

  const handleToggle = (field: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const currentData = formData && Object.keys(formData).length > 0 ? formData : preferences || {};

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading preferences...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notification Preferences</h2>
        <p className="text-muted-foreground">
          Manage how you receive notifications about church updates and events
        </p>
      </div>

      {/* Communication Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Channels
          </CardTitle>
          <CardDescription>
            Choose which channels you want to receive notifications through
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-3 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Switch
                checked={currentData.email_enabled ?? true}
                onCheckedChange={(value) =>
                  handleToggle("email_enabled", value)
                }
              />
            </div>
            {currentData.email_enabled && (
              <Input
                type="email"
                placeholder="Email address"
                value={currentData.email_address || ""}
                onChange={(e) =>
                  handleInputChange("email_address", e.target.value)
                }
                className="ml-8"
              />
            )}
          </div>

          {/* SMS */}
          <div className="space-y-3 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div>
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text message alerts
                  </p>
                </div>
              </div>
              <Switch
                checked={currentData.sms_enabled ?? true}
                onCheckedChange={(value) =>
                  handleToggle("sms_enabled", value)
                }
              />
            </div>
            {currentData.sms_enabled && (
              <Input
                placeholder="+1234567890"
                value={currentData.phone_number || ""}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                className="ml-8"
              />
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-3 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <div>
                  <Label className="text-base">WhatsApp Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive WhatsApp messages (coming soon)
                  </p>
                </div>
              </div>
              <Switch
                checked={currentData.whatsapp_enabled ?? false}
                onCheckedChange={(value) =>
                  handleToggle("whatsapp_enabled", value)
                }
                disabled
              />
            </div>
            {currentData.whatsapp_enabled && (
              <div className="ml-8 space-y-2">
                <Input
                  placeholder="+1234567890"
                  value={currentData.whatsapp_number || ""}
                  onChange={(e) =>
                    handleInputChange("whatsapp_number", e.target.value)
                  }
                  disabled
                />
                <Badge variant="outline">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Currently in development
                </Badge>
              </div>
            )}
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-amber-600" />
              <div>
                <Label className="text-base">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications within the application
                </p>
              </div>
            </div>
            <Switch
              checked={currentData.push_enabled ?? true}
              onCheckedChange={(value) =>
                handleToggle("push_enabled", value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Choose which types of events you want to be notified about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
            <div>
              <Label className="text-base font-semibold">Events & Conferences</Label>
              <p className="text-sm text-muted-foreground">
                Notifications about upcoming events and conferences
              </p>
            </div>
            <Switch
              checked={currentData.notify_events ?? true}
              onCheckedChange={(value) =>
                handleToggle("notify_events", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
            <div>
              <Label className="text-base font-semibold">Meetings</Label>
              <p className="text-sm text-muted-foreground">
                Notifications about church meetings and gatherings
              </p>
            </div>
            <Switch
              checked={currentData.notify_meetings ?? true}
              onCheckedChange={(value) =>
                handleToggle("notify_meetings", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
            <div>
              <Label className="text-base font-semibold">Announcements</Label>
              <p className="text-sm text-muted-foreground">
                Receive general church announcements and updates
              </p>
            </div>
            <Switch
              checked={currentData.notify_announcements ?? true}
              onCheckedChange={(value) =>
                handleToggle("notify_announcements", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
            <div>
              <Label className="text-base font-semibold">Prayer Requests</Label>
              <p className="text-sm text-muted-foreground">
                Notifications about prayer requests submitted by the community
              </p>
            </div>
            <Switch
              checked={currentData.notify_prayer_requests ?? true}
              onCheckedChange={(value) =>
                handleToggle("notify_prayer_requests", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
            <div>
              <Label className="text-base font-semibold">Finance Updates</Label>
              <p className="text-sm text-muted-foreground">
                Budget reports and financial summaries (admin only)
              </p>
            </div>
            <Switch
              checked={currentData.notify_finance_updates ?? false}
              onCheckedChange={(value) =>
                handleToggle("notify_finance_updates", value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
            <div>
              <Label className="text-base font-semibold">Attendance Updates</Label>
              <p className="text-sm text-muted-foreground">
                Service attendance summaries (admin only)
              </p>
            </div>
            <Switch
              checked={currentData.notify_attendance ?? false}
              onCheckedChange={(value) =>
                handleToggle("notify_attendance", value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setFormData({});
              setHasChanges(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      )}

      {!hasChanges && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          All settings are saved
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences;
