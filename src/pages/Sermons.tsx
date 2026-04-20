import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Music, Video, Youtube, Facebook, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useEffect, useState } from "react";
import apiService from "@/services/api";
import { motion } from "framer-motion";

const Sermons = () => {
  const { settings } = useSiteSettings();
  const [sermons, setSermons] = useState<any[]>([]);

  useEffect(() => {
    const loadSermons = async () => {
      const response = await apiService.getSermons({ ordering: '-date' });
      if (response.data) {
        setSermons(response.data.results || response.data);
      }
    };

    loadSermons();
  }, []);

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
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">THE WORD OF GOD</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Kingdom <span className="text-gradient-primary">Messages</span></h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Be encouraged and empowered by powerful, spirit-filled sermons from Bishop Paul Ndolo Mulu.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="h-14 px-10 rounded-full bg-red-600 hover:bg-red-700 text-white font-black shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
                  <Youtube className="h-6 w-6 mr-3" /> Watch on YouTube
                </Button>
              </a>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-2 border-primary/20 text-primary hover:bg-primary/5 font-black transition-all hover:scale-105 active:scale-95">
                  <Facebook className="h-6 w-6 mr-3" /> Join Community
                </Button>
              </a>
            </div>
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black tracking-tight mb-4">Latest Teachings</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>

          {sermons.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {sermons.map((s) => (
                <motion.div key={s.id} variants={itemVariants}>
                  <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background group overflow-hidden rounded-[2.5rem]">
                    <div className="aspect-video bg-muted relative overflow-hidden group">
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-primary text-white border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">{s.date}</Badge>
                      </div>
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <Music className="w-12 h-12 text-white/20" />
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-widest mb-4">
                        <Sparkles className="w-4 h-4" /> {s.topic || "Spiritual Growth"}
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-2">{s.title}</h3>
                      <p className="text-sm font-bold text-muted-foreground mb-8 flex items-center">
                        <Video className="w-4 h-4 mr-2 text-primary" /> {s.speaker}
                      </p>
                      
                      {s.video_url ? (
                        <a href={s.video_url} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-lg shadow-primary/20 transition-all">
                            Watch Message
                          </Button>
                        </a>
                      ) : (
                        <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="w-full rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary/5 font-bold h-12">
                            View on YouTube
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-none shadow-3xl overflow-hidden rounded-[3rem] bg-slate-900">
                <div className="w-full aspect-video relative">
                  <iframe className="w-full h-full" src="https://www.youtube.com/embed?listType=user_uploads&list=GLOBALPOWERCHURCH" title="GPC Sermons" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
                <div className="p-10 text-center">
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="h-16 px-12 rounded-full bg-white text-slate-900 hover:bg-white/90 text-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                      <Youtube className="h-6 w-6 mr-3 text-red-600" /> Watch More on YouTube
                    </Button>
                  </a>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-black mb-16 tracking-tight"
          >
            Where to Watch & Connect
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
              <Card className="h-full border-none shadow-xl bg-muted/20 p-10 rounded-[2.5rem] group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-red-600/10 transition-colors" />
                <Youtube className="h-20 w-20 mx-auto mb-8 text-red-600 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">Our YouTube Channel</h3>
                <p className="text-muted-foreground mb-8 font-medium text-lg leading-relaxed">Watch live services, daily prayers, and our complete sermon archive.</p>
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-xl shadow-red-600/20">
                    Subscribe Now
                  </Button>
                </a>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
              <Card className="h-full border-none shadow-xl bg-muted/20 p-10 rounded-[2.5rem] group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />
                <Facebook className="h-20 w-20 mx-auto mb-8 text-blue-600 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">Facebook Community</h3>
                <p className="text-muted-foreground mb-8 font-medium text-lg leading-relaxed">Join our vibrant online group for daily encouragement and prayer requests.</p>
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/20">
                    Join the Group
                  </Button>
                </a>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sermons;
