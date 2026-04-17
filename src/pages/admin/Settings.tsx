import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings as SettingsIcon, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { siteSettingsDefaults, type SiteSettings } from "@/hooks/use-site-settings";

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings>(siteSettingsDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

   useEffect(() => {
     const fetch = async () => {
       const response = await apiService.getSiteSettings();
       if (response.data) {
         const merged = { ...siteSettingsDefaults };
         Object.assign(merged, response.data);
         setSettings(merged);
       }
       setLoading(false);
     };
     fetch();
   }, []);

  const saveSetting = async (key: string, value: any) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    return error;
  };

   const handleSaveAll = async () => {
     setSaving(true);
     const response = await apiService.bulkUpdateSiteSettings(settings as Record<string, any>);
     setSaving(false);
     if (response.error) {
       toast({ title: "Error saving settings", variant: "destructive" });
     } else {
       toast({ title: "All settings saved successfully!" });
     }
   };

  const addService = () => {
    setSettings({
      ...settings,
      services: [...settings.services, { title: "", day: "", time: "", description: "" }],
    });
  };

  const removeService = (i: number) => {
    setSettings({ ...settings, services: settings.services.filter((_, idx) => idx !== i) });
  };

  const updateService = (i: number, field: string, value: string) => {
    const updated = [...settings.services];
    (updated[i] as any)[field] = value;
    setSettings({ ...settings, services: updated });
  };

  const addMinistry = () => {
    setSettings({
      ...settings,
      ministries: [...settings.ministries, { title: "", description: "" }],
    });
  };

  const removeMinistry = (i: number) => {
    setSettings({ ...settings, ministries: settings.ministries.filter((_, idx) => idx !== i) });
  };

  const updateMinistry = (i: number, field: string, value: string) => {
    const updated = [...settings.ministries];
    (updated[i] as any)[field] = value;
    setSettings({ ...settings, ministries: updated });
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading settings...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Site Settings</h2>
        <Button onClick={handleSaveAll} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><SettingsIcon className="h-5 w-5 text-primary" />Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Phone Number</Label><Input value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} /></div>
            <div><Label>Email Address</Label><Input value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} /></div>
            <div><Label>WhatsApp Number (with country code, no +)</Label><Input value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="254704129211" /></div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>YouTube URL</Label><Input value={settings.youtube_url} onChange={e => setSettings({ ...settings, youtube_url: e.target.value })} /></div>
          <div><Label>Facebook Group URL</Label><Input value={settings.facebook_url} onChange={e => setSettings({ ...settings, facebook_url: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Service Times</CardTitle>
            <Button size="sm" onClick={addService} variant="outline"><Plus className="h-4 w-4 mr-1" />Add Service</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.services.map((s, i) => (
            <div key={i} className="grid sm:grid-cols-5 gap-2 items-end border-b border-border pb-3">
              <div><Label>Title</Label><Input value={s.title} onChange={e => updateService(i, "title", e.target.value)} /></div>
              <div><Label>Day</Label><Input value={s.day} onChange={e => updateService(i, "day", e.target.value)} /></div>
              <div><Label>Time</Label><Input value={s.time} onChange={e => updateService(i, "time", e.target.value)} /></div>
              <div><Label>Description</Label><Input value={s.description} onChange={e => updateService(i, "description", e.target.value)} /></div>
              <Button variant="ghost" size="icon" onClick={() => removeService(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ministries */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ministries</CardTitle>
            <Button size="sm" onClick={addMinistry} variant="outline"><Plus className="h-4 w-4 mr-1" />Add Ministry</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.ministries.map((m, i) => (
            <div key={i} className="grid sm:grid-cols-3 gap-2 items-end border-b border-border pb-3">
              <div><Label>Title</Label><Input value={m.title} onChange={e => updateMinistry(i, "title", e.target.value)} /></div>
              <div><Label>Description</Label><Input value={m.description} onChange={e => updateMinistry(i, "description", e.target.value)} /></div>
              <Button variant="ghost" size="icon" onClick={() => removeMinistry(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
