import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Save, Plus, Trash2, Palette, Image, Phone, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { siteSettingsDefaults, type SiteSettings } from "@/hooks/use-site-settings";

// Extended settings type
interface ExtendedSettings extends SiteSettings {
  logo_url?: string;
  church_name?: string;
  tagline?: string;
  address?: string;
  primary_color?: string;
  secondary_color?: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<ExtendedSettings>({
    ...siteSettingsDefaults,
    logo_url: "/images/gpc-logo.jpg",
    church_name: "Global Power Church",
    tagline: "Empowering Lives Through Faith",
    address: "Nairobi, Kenya",
    primary_color: "300 60% 35%",
    secondary_color: "43 80% 50%",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const response = await apiService.getSiteSettings();
      if (response.data) {
        const data = response.data as any;
        const merged = { ...siteSettingsDefaults };
        // Site settings come as array of {key, value} or flat object
        if (Array.isArray(data)) {
          data.forEach((item: any) => { (merged as any)[item.key] = item.value; });
        } else if (data.results) {
          data.results.forEach((item: any) => { (merged as any)[item.key] = item.value; });
        } else {
          Object.assign(merged, data);
        }
        setSettings(prev => ({ ...prev, ...merged }));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const applyColorToDOM = (primary: string, secondary: string) => {
    const root = document.documentElement;
    if (primary) root.style.setProperty("--primary", primary);
    if (secondary) root.style.setProperty("--secondary", secondary);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const response = await apiService.bulkUpdateSiteSettings(settings as Record<string, any>);
    setSaving(false);
    if (response.error) {
      toast({ title: "Error saving settings", description: response.error, variant: "destructive" });
    } else {
      // Apply color changes immediately
      if (settings.primary_color) applyColorToDOM(settings.primary_color, settings.secondary_color || "");
      toast({ title: "✅ Settings saved!", description: "Changes are now live across the site." });
    }
  };

  const addService = () => setSettings({ ...settings, services: [...settings.services, { title: "", day: "", time: "", description: "" }] });
  const removeService = (i: number) => setSettings({ ...settings, services: settings.services.filter((_, idx) => idx !== i) });
  const updateService = (i: number, field: string, value: string) => {
    const updated = [...settings.services]; (updated[i] as any)[field] = value;
    setSettings({ ...settings, services: updated });
  };

  const addMinistry = () => setSettings({ ...settings, ministries: [...settings.ministries, { title: "", description: "" }] });
  const removeMinistry = (i: number) => setSettings({ ...settings, ministries: settings.ministries.filter((_, idx) => idx !== i) });
  const updateMinistry = (i: number, field: string, value: string) => {
    const updated = [...settings.ministries]; (updated[i] as any)[field] = value;
    setSettings({ ...settings, ministries: updated });
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading settings...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground">Site Settings</h2>
          <p className="text-sm text-muted-foreground">Changes take effect immediately after saving</p>
        </div>
        <Button onClick={handleSaveAll} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      <Tabs defaultValue="identity">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* IDENTITY TAB */}
        <TabsContent value="identity" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Image className="h-5 w-5 text-primary" />Church Identity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Church Name</Label>
                  <Input value={settings.church_name || ""} onChange={e => setSettings({ ...settings, church_name: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label>Tagline / Motto</Label>
                  <Input value={settings.tagline || ""} onChange={e => setSettings({ ...settings, tagline: e.target.value })} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label>Address / Location</Label>
                <Input value={settings.address || ""} onChange={e => setSettings({ ...settings, address: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Logo URL</Label>
                <div className="flex gap-3 mt-1.5">
                  <Input
                    value={settings.logo_url || ""}
                    onChange={e => setSettings({ ...settings, logo_url: e.target.value })}
                    placeholder="/images/gpc-logo.jpg or https://..."
                    className="flex-1"
                  />
                  {settings.logo_url && (
                    <img src={settings.logo_url} alt="Logo preview" className="h-10 w-10 rounded-lg object-cover border" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enter the path to your logo image or a full URL.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Color Theme</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">Colors use HSL format: <code className="bg-muted px-1 rounded">H S% L%</code>. Example: <code className="bg-muted px-1 rounded">300 60% 35%</code></p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label>Primary Color (HSL)</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      value={settings.primary_color || ""}
                      onChange={e => setSettings({ ...settings, primary_color: e.target.value })}
                      placeholder="300 60% 35%"
                      className="flex-1"
                    />
                    <div
                      className="h-10 w-10 rounded-lg border shadow-sm flex-shrink-0"
                      style={{ backgroundColor: `hsl(${settings.primary_color || "300 60% 35%"})` }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Secondary Color (HSL)</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      value={settings.secondary_color || ""}
                      onChange={e => setSettings({ ...settings, secondary_color: e.target.value })}
                      placeholder="43 80% 50%"
                      className="flex-1"
                    />
                    <div
                      className="h-10 w-10 rounded-lg border shadow-sm flex-shrink-0"
                      style={{ backgroundColor: `hsl(${settings.secondary_color || "43 80% 50%"})` }}
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => applyColorToDOM(settings.primary_color || "", settings.secondary_color || "")}
                className="w-full"
              >
                <Palette className="h-4 w-4 mr-2" />Preview Colors (before saving)
              </Button>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Common Church Color Presets:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Royal Purple", p: "300 60% 35%", s: "43 80% 50%" },
                    { name: "Deep Blue", p: "220 80% 40%", s: "38 90% 55%" },
                    { name: "Forest Green", p: "150 60% 30%", s: "45 85% 55%" },
                    { name: "Crimson Red", p: "0 70% 40%", s: "35 85% 55%" },
                    { name: "Navy & Gold", p: "230 70% 30%", s: "45 80% 55%" },
                  ].map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => { setSettings({ ...settings, primary_color: preset.p, secondary_color: preset.s }); applyColorToDOM(preset.p, preset.s); }}
                      className="px-3 py-1.5 text-xs rounded-full border hover:shadow-md transition-all font-medium"
                      style={{ backgroundColor: `hsl(${preset.p})`, color: "white", borderColor: `hsl(${preset.p})` }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACT TAB */}
        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-primary" />Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Phone Number</Label><Input value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Email Address</Label><Input value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="mt-1.5" /></div>
                <div><Label>WhatsApp (with country code, no +)</Label><Input value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="254704129211" className="mt-1.5" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Link className="h-5 w-5 text-primary" />Social Media Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>YouTube URL</Label><Input value={settings.youtube_url} onChange={e => setSettings({ ...settings, youtube_url: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Facebook Group URL</Label><Input value={settings.facebook_url} onChange={e => setSettings({ ...settings, facebook_url: e.target.value })} className="mt-1.5" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Service Times</CardTitle>
                <Button size="sm" onClick={addService} variant="outline"><Plus className="h-4 w-4 mr-1" />Add Service</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {settings.services.map((s, i) => (
                <div key={i} className="grid sm:grid-cols-5 gap-2 items-end border rounded-lg p-3 bg-muted/30">
                  <div><Label className="text-xs">Title</Label><Input value={s.title} onChange={e => updateService(i, "title", e.target.value)} className="mt-1" /></div>
                  <div><Label className="text-xs">Day</Label><Input value={s.day} onChange={e => updateService(i, "day", e.target.value)} className="mt-1" /></div>
                  <div><Label className="text-xs">Time</Label><Input value={s.time} onChange={e => updateService(i, "time", e.target.value)} className="mt-1" /></div>
                  <div><Label className="text-xs">Description</Label><Input value={s.description} onChange={e => updateService(i, "description", e.target.value)} className="mt-1" /></div>
                  <Button variant="ghost" size="icon" onClick={() => removeService(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ministries</CardTitle>
                <Button size="sm" onClick={addMinistry} variant="outline"><Plus className="h-4 w-4 mr-1" />Add Ministry</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {settings.ministries.map((m, i) => (
                <div key={i} className="grid sm:grid-cols-3 gap-2 items-end border rounded-lg p-3 bg-muted/30">
                  <div><Label className="text-xs">Title</Label><Input value={m.title} onChange={e => updateMinistry(i, "title", e.target.value)} className="mt-1" /></div>
                  <div><Label className="text-xs">Description</Label><Input value={m.description} onChange={e => updateMinistry(i, "description", e.target.value)} className="mt-1" /></div>
                  <Button variant="ghost" size="icon" onClick={() => removeMinistry(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
