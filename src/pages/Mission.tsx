import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Book, Globe, Sparkles, Shield, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Mission = () => {
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
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">KINGDOM PURPOSE</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Mission & <span className="text-gradient-primary">Vision</span></h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Our God-given purpose and direction as we serve our generation through the power of the Holy Spirit.
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
            className="max-w-4xl mx-auto text-center mb-24"
          >
            <motion.div variants={itemVariants}>
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tight">Our Mission</h2>
              <Card className="border-none shadow-3xl overflow-hidden rounded-[3rem] bg-background relative p-8 md:p-16 group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <CardContent className="p-0 relative z-10">
                  <p className="text-2xl md:text-4xl text-foreground font-black leading-tight italic">
                    "To demonstrate God's power, transform lives through the Gospel of Jesus Christ, and raise a generation of empowered believers."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          >
            {[
              { icon: Heart, title: "Worship God", desc: "We worship with passion and power, creating an atmosphere for miracles.", color: "bg-red-500/10 text-red-500" },
              { icon: Users, title: "Build Community", desc: "We nurture authentic relationships based on love, trust, and mutual support.", color: "bg-blue-500/10 text-blue-500" },
              { icon: Book, title: "Teach the Word", desc: "We equip believers with uncompromised Scripture to live victorious lives.", color: "bg-primary/10 text-primary" },
              { icon: Globe, title: "Reach the World", desc: "We spread the gospel globally through crusades, media, and missions.", color: "bg-secondary/10 text-secondary" },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="text-center h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background p-8 rounded-[2.5rem] hover-lift group">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
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
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-white leading-tight">Our <span className="text-primary">Vision</span></h2>
              <p className="text-2xl md:text-3xl text-white/90 font-black mb-10 italic leading-snug">
                "To be a powerhouse of God's glory — a church where every believer walks in divine power, purpose, and destiny."
              </p>
              <div className="h-px w-24 bg-white/20 mx-auto mb-10" />
              <p className="text-xl text-white/60 font-medium max-w-2xl mx-auto">
                Under Bishop Paul Ndolo Mulu's leadership, we envision a global movement that raises spirit-filled leaders and transforms entire communities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Mission;
