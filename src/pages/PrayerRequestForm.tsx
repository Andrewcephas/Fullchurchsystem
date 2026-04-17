import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
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
      toast({ title: "Name and prayer request are required", variant: "destructive" });
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
      toast({ title: "Error submitting", description: response.error, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Prayer request submitted", description: "Our prayer team will pray for you." });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <Heart className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground">Your prayer request has been submitted. Our prayer team will be praying for you. God bless you.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Prayer Request</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your prayer needs with us. Our prayer team at Global Power Church will lift you up in prayer.
          </p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-lg">
          <Card>
            <CardHeader><CardTitle>Submit Your Prayer Request</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Your Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><Label>Email (optional)</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <div><Label>Prayer Request *</Label><Textarea value={form.request} onChange={e => setForm({...form, request: e.target.value})} rows={5} required placeholder="Share your prayer need..." /></div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Prayer Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PrayerRequestForm;
