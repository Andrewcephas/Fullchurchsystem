import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

const PrayerRequestForm = () => {
  const [form, setForm] = useState({ name: "", email: "", request: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.request) {
      toast({ title: "Fields required", description: "Name and prayer request are essential.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const response = await apiService.createPrayerRequest({
      name: form.name,
      email: form.email || null,
      request: form.request
    });
    setSubmitting(false);
    if (response.error) {
      toast({ title: "Submission Error", description: response.error, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Request Received", description: "Our prayer team is already lifting you up." });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_70%)]" />
        <Card className="max-w-md w-full glass-card border-none p-12 text-center relative z-10 animate-float">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Heart className="h-12 w-12 text-primary fill-primary/20" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Peace be with you</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Your prayer request has been received. Our team at Global Power Church is standing with you in faith. Expect God's move in your situation.
          </p>
          <Button variant="outline" className="rounded-full px-8" onClick={() => setSubmitted(false)}>
            Send another request
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.08),transparent_70%)]" />
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4 rounded-full px-4 py-1 bg-primary/10 text-primary border-primary/20 animate-float">
            We are here for you
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight gradient-text">
            Prayer Request
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Share your burden with us. We believe in the power of collective prayer and God's miraculous intervention.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-2xl">
          <Card className="glass-card border-none overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
            <CardHeader className="pt-12 px-10">
              <CardTitle className="text-2xl font-bold">Your Details</CardTitle>
            </CardHeader>
            <CardContent className="px-10 pb-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name *</Label>
                  <Input 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                    className="bg-background/50 border-primary/10 h-12 rounded-xl focus:ring-primary focus:border-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address (Optional)</Label>
                  <Input 
                    type="email" 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    className="bg-background/50 border-primary/10 h-12 rounded-xl focus:ring-primary focus:border-primary transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Your Prayer Request *</Label>
                  <Textarea 
                    value={form.request} 
                    onChange={e => setForm({...form, request: e.target.value})} 
                    rows={6} 
                    required 
                    className="bg-background/50 border-primary/10 rounded-xl focus:ring-primary focus:border-primary transition-all resize-none"
                    placeholder="How can we pray for you?"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : "Submit Request"}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4 italic">
                  "Come to me, all you who are weary and burdened, and I will give you rest." — Matthew 11:28
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PrayerRequestForm;
