import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Sparkles, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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

<<<<<<< HEAD
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
    <div className="min-h-screen bg-background">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">DIVINE INTERCESSION</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Prayer <span className="text-gradient-primary">Request</span></h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Share your burden with us. Our prayer team at Global Power Church believes in the power of agreement.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-none shadow-3xl overflow-hidden rounded-[3rem] bg-background relative p-8 md:p-12">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Heart className="w-32 h-32 text-primary" />
                  </div>
                  <CardHeader className="p-0 mb-10 text-center">
                    <CardTitle className="text-3xl font-black tracking-tight mb-2">Submit Your Request</CardTitle>
                    <p className="text-muted-foreground font-medium">Everything you share is kept confidential.</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-3">
                        <Label className="text-base font-black tracking-tight uppercase text-muted-foreground text-[10px]">Your Name *</Label>
                        <Input 
                          value={form.name} 
                          onChange={e => setForm({...form, name: e.target.value})} 
                          required 
                          className="h-14 rounded-2xl border-2 border-muted bg-muted/20 focus:border-primary/50 focus:bg-background transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-black tracking-tight uppercase text-muted-foreground text-[10px]">Email (optional)</Label>
                        <Input 
                          type="email" 
                          value={form.email} 
                          onChange={e => setForm({...form, email: e.target.value})} 
                          className="h-14 rounded-2xl border-2 border-muted bg-muted/20 focus:border-primary/50 focus:bg-background transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-black tracking-tight uppercase text-muted-foreground text-[10px]">Prayer Request *</Label>
                        <Textarea 
                          value={form.request} 
                          onChange={e => setForm({...form, request: e.target.value})} 
                          rows={6} 
                          required 
                          placeholder="Share your prayer need with us..." 
                          className="rounded-[2rem] border-2 border-muted bg-muted/20 focus:border-primary/50 focus:bg-background transition-all p-6 text-lg"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" 
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 animate-spin" /> SUBMITTING...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-5 w-5" /> SUBMIT PRAYER REQUEST
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Card className="border-none shadow-3xl overflow-hidden rounded-[3rem] bg-background p-12 md:p-20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                  <CardContent className="p-0 relative z-10">
                    <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <h2 className="text-4xl font-black text-foreground mb-6 tracking-tight">Request Received!</h2>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10">
                      Your prayer request has been submitted. Our dedicated prayer team will stand in agreement with you. God bless you.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="h-14 px-10 rounded-2xl border-2 border-muted hover:bg-muted font-black"
                    >
                      SEND ANOTHER REQUEST
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-lg font-black tracking-tight text-foreground">CONFIDENTIAL</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Heart className="h-6 w-6" />
              </div>
              <p className="text-lg font-black tracking-tight text-foreground">COMPASSIONATE</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-lg font-black tracking-tight text-foreground">FAITH-FILLED</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrayerRequestForm;
