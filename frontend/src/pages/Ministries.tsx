import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, MessageSquare, ArrowRight, Shield, Heart, Zap } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Ministries = () => {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello, I want to learn more about ministries")}`;

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
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">SERVE THE KINGDOM</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Our <span className="text-gradient-primary">Ministries</span></h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Find your divine place of service and grow in God's power as we impact our generation together.
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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {settings.ministries.map((m, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift bg-background p-6 rounded-[2.5rem] overflow-hidden group">
                  <CardHeader className="p-0 mb-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                      <Users className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{m.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col h-full">
                    <p className="text-muted-foreground font-medium leading-relaxed text-center mb-8 flex-1">{m.description || "Join this dynamic ministry as we serve the Lord and His people with excellence and power."}</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full rounded-2xl bg-muted text-foreground hover:bg-primary hover:text-white border-none font-bold h-12 transition-all">
                        Join {m.title} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 md:p-20 text-center shadow-3xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-white leading-tight">Ready to <span className="text-secondary">Impact Lives?</span></h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium">Every member of Global Power Church has a God-given gift and a unique place to serve in the Kingdom work.</p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="h-16 px-12 rounded-full bg-white text-slate-900 hover:bg-white/90 text-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <MessageSquare className="mr-3 h-6 w-6" /> Contact Us to Get Started
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;
