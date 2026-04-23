import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Clock, ExternalLink, Youtube, Facebook, Sparkles, Radio } from "lucide-react";
import { motion } from "framer-motion";

const YOUTUBE_URL = "https://www.youtube.com/@GLOBALPOWERCHURCH";
const FACEBOOK_URL = "https://www.facebook.com/groups/1202497280341977";

const LiveStream = () => {
  const services = [
    { title: "Sunday Main Service", day: "Every Sunday", time: "Main Service", speaker: "Bishop Paul Ndolo Mulu" },
    { title: "Thursday Prayers", day: "Every Thursday", time: "4:00 – 6:00 PM", speaker: "Bishop Paul Ndolo Mulu" },
    { title: "Friday Kesha", day: "Every Friday", time: "Night Service", speaker: "Bishop Paul Ndolo Mulu" },
    { title: "Saturday Devotion", day: "Every Saturday", time: "6:00 – 7:00 AM", speaker: "Bishop Paul Ndolo Mulu" },
  ];

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
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge className="bg-red-600 text-white border-none px-4 py-1 rounded-full font-black flex items-center gap-2 animate-pulse">
                <Radio className="h-3 w-3" /> LIVE NOW
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Digital <span className="text-gradient-primary">Sanctuary</span></h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the power and presence of God from anywhere in the world. Join our global online family.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="h-16 px-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-black shadow-2xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
                  <Youtube className="h-6 w-6 mr-3" /> Watch on YouTube
                </Button>
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-16 px-12 rounded-full border-2 border-primary/20 text-primary hover:bg-primary/5 font-black transition-all hover:scale-105 active:scale-95">
                  <Facebook className="h-6 w-6 mr-3" /> Join Community
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border-none shadow-3xl overflow-hidden rounded-[3rem] bg-slate-900 group"
          >
            <div className="w-full aspect-video bg-black relative">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed?listType=user_uploads&list=GLOBALPOWERCHURCH" title="GPC Live" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Global Power Church Live</h3>
                <p className="text-primary font-black tracking-widest uppercase text-sm">BISHOP PAUL NDOLO MULU</p>
              </div>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                <Button size="lg" className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-white/90 font-black px-10">
                  <Play className="h-5 w-5 mr-3 fill-current" /> Open Channel
                </Button>
              </a>
            </div>
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black tracking-tight mb-4">Stream Schedule</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {services.map((s, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-muted/20 p-8 rounded-[2.5rem] hover-lift group text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                    <Calendar className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight mb-4 leading-tight group-hover:text-primary transition-colors">{s.title}</CardTitle>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold text-sm uppercase tracking-wider">
                      <Clock className="h-4 w-4 text-secondary" /> {s.time}
                    </div>
                    <p className="text-primary font-black text-xs uppercase tracking-widest">{s.speaker}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white leading-tight">Join the Global <span className="text-secondary">Community</span></h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">Subscribe and join thousands of believers receiving God's power daily.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-16 px-12 rounded-full bg-white text-primary hover:bg-white/90 text-xl font-black shadow-2xl transition-all">
                    YouTube Subscribe
                  </Button>
                </a>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-16 px-12 rounded-full border-2 border-white/20 text-white hover:bg-white/5 text-xl font-black transition-all">
                    Join Facebook Group
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LiveStream;
