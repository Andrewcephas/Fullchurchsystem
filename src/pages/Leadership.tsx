import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Shield, Star, Users, ArrowRight, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Leadership = () => {
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
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">DIVINE LEADERSHIP</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Our <span className="text-gradient-primary">Anointed Leaders</span></h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Guided by a vision to demonstrate God's power and transform lives through the uncompromised word.
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
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-3xl overflow-hidden rounded-[3rem] bg-background relative group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Shield className="w-64 h-64 text-primary" />
                </div>
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className="md:w-1/3 bg-slate-900 flex items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                    <img src="/images/gpc-logo.jpg" alt="Bishop Paul Ndolo Mulu" className="w-48 h-48 rounded-[3rem] object-cover border-4 border-primary/20 shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 p-10 md:p-16 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <Star className="h-6 w-6 text-primary fill-current" />
                      <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">SENIOR BISHOP</Badge>
                    </div>
                    <CardTitle className="text-4xl font-black mb-4 tracking-tight">Bishop Paul Ndolo Mulu</CardTitle>
                    <p className="text-primary font-black text-xl mb-8 tracking-wide">Founder & Spiritual Father</p>
                    <div className="relative">
                      <Quote className="absolute -top-4 -left-4 w-8 h-8 text-primary/10" />
                      <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-10 pl-4 border-l-2 border-primary/10">
                        Bishop Paul Ndolo Mulu is the founder and spiritual leader of Global Power Church. Called by God to demonstrate His power and transform lives, Bishop Mulu has dedicated his life to preaching the uncompromised Gospel and raising a generation of believers who walk in the miraculous.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <a href="mailto:paulndolo1972@gmail.com" className="flex items-center gap-3 text-base font-bold text-muted-foreground hover:text-primary transition-all group/link">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover/link:bg-primary transition-colors">
                          <Mail className="h-5 w-5 group-hover/link:text-white" />
                        </div>
                        paulndolo1972@gmail.com
                      </a>
                      <a href="tel:+254704129211" className="flex items-center gap-3 text-base font-bold text-muted-foreground hover:text-primary transition-all group/link">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover/link:bg-primary transition-colors">
                          <Phone className="h-5 w-5 group-hover/link:text-white" />
                        </div>
                        +254 704 129 211
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Ministry Leadership</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          >
            {[
              { dept: "Choir Ministry", role: "Choir Director", icon: Users },
              { dept: "Praise & Worship", role: "Worship Leader", icon: Users },
              { dept: "Dance Ministry", role: "Dance Coordinator", icon: Users },
              { dept: "Youth Ministry", role: "Youth Leader", icon: Users },
              { dept: "Women Ministry", role: "Women Leader", icon: Users },
              { dept: "Men Ministry", role: "Men Leader", icon: Users },
              { dept: "Hospitality", role: "Hospitality Coordinator", icon: Users },
              { dept: "Crusades & Outreach", role: "Outreach Director", icon: Users },
            ].map((leader, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="text-center h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-muted/20 p-8 rounded-[2rem] hover-lift group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                    <span className="text-primary font-black text-2xl group-hover:text-white transition-colors">{leader.dept[0]}</span>
                  </div>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-black tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors">{leader.dept}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-primary font-black tracking-widest uppercase text-xs mb-4">{leader.role}</p>
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-muted-foreground">VIEW PROFILE</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
