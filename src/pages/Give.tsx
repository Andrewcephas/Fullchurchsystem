import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Heart, Play, ExternalLink } from "lucide-react";
=======
import { Heart, Sparkles, MessageSquare, ArrowRight, Shield, Zap, Gift } from "lucide-react";
>>>>>>> 0697c9f91682da633fa6e48c667a3ef4878cfa9e
import { useSiteSettings } from "@/hooks/use-site-settings";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Give = () => {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello, I would like to partner with Global Power Church through giving")}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">KINGDOM PARTNERSHIP</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Partner with <span className="text-gradient-primary">Us</span></h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Your generosity empowers us to spread the gospel and transform lives through the power of God across the globe.
            </p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="h-16 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                <Heart className="h-6 w-6 mr-3 fill-current" /> Give Now via WhatsApp
              </Button>
            </a>
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
            <h2 className="text-4xl font-black tracking-tight mb-4">The Heart of Giving</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-12" />
            
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-2xl overflow-hidden rounded-[3rem] bg-background p-8 md:p-16 relative">
                <div className="absolute top-0 left-0 p-8 opacity-5">
                  <Gift className="w-32 h-32 text-primary" />
                </div>
                <CardContent className="relative z-10 p-0">
                  <p className="text-2xl md:text-3xl text-foreground font-black leading-tight italic mb-8">
                    "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-primary/30" />
                    <p className="text-primary font-black text-xl tracking-widest uppercase">2 Corinthians 9:7</p>
                    <div className="h-px w-8 bg-primary/30" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full border-none shadow-xl bg-background p-10 rounded-[3rem] text-center group overflow-hidden">
                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                  <Zap className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">Advance the Kingdom</h3>
                <p className="text-muted-foreground font-medium mb-0 leading-relaxed">Your tithes and offerings help us organize crusades, conferences, and community outreach programs.</p>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full border-none shadow-xl bg-background p-10 rounded-[3rem] text-center group overflow-hidden">
                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-secondary/5 flex items-center justify-center group-hover:bg-secondary transition-colors duration-500">
                  <Shield className="h-10 w-10 text-secondary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">Secure Giving</h3>
                <p className="text-muted-foreground font-medium mb-0 leading-relaxed">We provide clear instructions via WhatsApp to ensure your giving is handled securely and correctly.</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Heart className="h-10 w-10 text-white fill-current" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-white leading-tight">Your Giving <span className="text-primary">Makes a Difference</span></h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium">Through your generosity, Global Power Church reaches more souls for Christ every single day.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="h-16 px-12 rounded-full bg-white text-slate-900 hover:bg-white/90 text-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                    <MessageSquare className="mr-3 h-6 w-6" /> Message for Instructions
                  </Button>
                </a>
              </div>
              <p className="mt-8 text-white/40 font-black tracking-widest uppercase text-sm">WhatsApp: {settings.phone}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Give;
