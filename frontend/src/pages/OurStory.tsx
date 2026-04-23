import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Heart, Book, Sparkles, MapPin, Radio, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const OurStory = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
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
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">A LEGACY OF FAITH</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Our <span className="text-gradient-primary">Journey</span></h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Founded on faith, built by God's power. Experience the miraculous story of Global Power Church.
            </p>
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
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">How It All Began</h2>
            <Card className="border-none shadow-xl overflow-hidden rounded-[3rem] bg-background p-8 md:p-16 group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles className="w-32 h-32 text-primary" />
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed relative z-10">
                Global Power Church was founded by Bishop Paul Ndolo Mulu with a divine mandate to spread the gospel and demonstrate God's power. What started as a small gathering of believers has transformed into a global spiritual movement.
              </p>
            </Card>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-12 relative"
          >
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/10 -translate-x-1/2 hidden md:block" />
            
            {[
              { icon: Calendar, title: "The Foundation", text: "Bishop Paul Ndolo Mulu received a clear calling from God to establish a ministry that would demonstrate God's power and bring deliverance to the captives." },
              { icon: Users, title: "Growing Community", text: "As miracles became a daily occurrence and lives were transformed, the church grew rapidly, establishing multiple ministries to serve every generation." },
              { icon: MapPin, title: "Crusades & Expansion", text: "The ministry expanded beyond the sanctuary through massive crusades and yearly conferences, touching thousands of souls with the message of hope." },
              { icon: Radio, title: "Digital Transformation", text: "Embracing the digital age, Global Power Church now streams powerful services to a worldwide audience through YouTube and social media." },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 flex justify-center">
                  <Card className="border-none shadow-xl bg-background p-10 rounded-[2.5rem] group hover:bg-primary transition-colors duration-500 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                      <item.icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <CardTitle className="text-2xl font-black mb-4 tracking-tight group-hover:text-white transition-colors">{item.title}</CardTitle>
                    <p className="text-muted-foreground font-medium leading-relaxed group-hover:text-white/80 transition-colors">{item.text}</p>
                  </Card>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary border-4 border-background shadow-lg z-10 hidden md:block" />
                <div className="md:w-1/2" />
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
            className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white leading-tight">Become Part of <span className="text-secondary">Our Story</span></h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium">God is still writing amazing chapters of power and transformation. Join us and experience the miracle for yourself.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
