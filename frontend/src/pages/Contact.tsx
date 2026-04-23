import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock, MessageSquare, ExternalLink, MapPin, Youtube, Facebook, Sparkles, ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Contact = () => {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello Global Power Church")}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

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
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">GET IN TOUCH</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">We're Here for <span className="text-gradient-primary">You</span></h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Have questions or need prayer? Reach out to us through any of our channels. We'd love to connect with you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <a href={`tel:+${settings.whatsapp}`} className="group">
                <Card className="text-center border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift bg-background p-8 rounded-[2.5rem] h-full">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                    <Phone className="h-10 w-10 text-primary group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight mb-4">Call Us</CardTitle>
                  <p className="font-black text-xl text-foreground mb-2">{settings.phone}</p>
                  <p className="text-muted-foreground font-bold text-sm">Direct Line to Ministry</p>
                </Card>
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <a href={`mailto:${settings.email}`} className="group">
                <Card className="text-center border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift bg-background p-8 rounded-[2.5rem] h-full">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-secondary/5 flex items-center justify-center group-hover:bg-secondary transition-colors duration-500">
                    <Mail className="h-10 w-10 text-secondary group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight mb-4">Email Us</CardTitle>
                  <p className="font-black text-xl text-foreground mb-2 break-all">{settings.email}</p>
                  <p className="text-muted-foreground font-bold text-sm">Official Correspondence</p>
                </Card>
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="text-center border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift bg-background p-8 rounded-[2.5rem] h-full">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-green-500/5 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-500">
                    <MessageSquare className="h-10 w-10 text-green-500 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight mb-4">WhatsApp</CardTitle>
                  <p className="font-black text-xl text-foreground mb-2">{settings.phone}</p>
                  <p className="text-muted-foreground font-bold text-sm">Instant Prayer & Support</p>
                </Card>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black tracking-tight mb-4 flex items-center justify-center gap-4">
              <Clock className="h-10 w-10 text-primary" /> Service Schedule
            </h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <Card className="border-none shadow-2xl overflow-hidden rounded-[3rem] bg-muted/20">
              <CardContent className="p-10">
                <div className="space-y-6">
                  {settings.services.map((s, i) => (
                    <motion.div 
                      key={i} 
                      variants={itemVariants}
                      className="flex flex-col sm:flex-row justify-between items-center p-6 bg-background rounded-3xl border border-border/50 group hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                          {s.day.substring(0, 3)}
                        </div>
                        <span className="text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{s.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xl font-bold text-muted-foreground uppercase tracking-wider">
                        <Clock className="h-5 w-5 text-secondary" /> {s.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black tracking-tight mb-4">Connect Online</h2>
            <p className="text-muted-foreground font-medium">Join our vibrant digital community.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid sm:grid-cols-2 gap-10"
          >
            <motion.div variants={itemVariants}>
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background p-10 rounded-[3rem] text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-red-600/10 transition-colors" />
                  <Youtube className="h-20 w-20 mx-auto mb-8 text-red-600 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">YouTube</h3>
                  <p className="text-muted-foreground font-medium mb-10 leading-relaxed">Watch our powerful messages and live services anytime, anywhere.</p>
                  <Button className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg">Visit Channel</Button>
                </Card>
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background p-10 rounded-[3rem] text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />
                  <Facebook className="h-20 w-20 mx-auto mb-8 text-blue-600 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">Facebook</h3>
                  <p className="text-muted-foreground font-medium mb-10 leading-relaxed">Join our Facebook group for daily encouragement and fellowship.</p>
                  <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg">Join Group</Button>
                </Card>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white leading-tight">Ready to Experience <span className="text-secondary">God's Power?</span></h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">Join us this Sunday or reach out via WhatsApp for a life-transforming encounter.</p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="h-16 px-12 rounded-full bg-white text-primary hover:bg-white/90 text-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <MessageSquare className="mr-3 h-6 w-6" /> Chat on WhatsApp Now
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
