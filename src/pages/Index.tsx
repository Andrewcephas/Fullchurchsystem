import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Book, Heart, Phone, Mail, Play, Music, MessageSquare, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useEffect, useState } from "react";
import apiService from "@/services/api";
import { motion } from "framer-motion";

const Index = () => {
  const { settings } = useSiteSettings();
  const [events, setEvents] = useState<any[]>([]);
  const [sermons, setSermons] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const eventsResponse = await apiService.getEvents({ limit: 4, ordering: '-date' });
      if (eventsResponse.data) {
        setEvents(eventsResponse.data.results || eventsResponse.data);
      }

      const sermonsResponse = await apiService.getSermons({ limit: 3, ordering: '-date' });
      if (sermonsResponse.data) {
        setSermons(sermonsResponse.data.results || sermonsResponse.data);
      }
    };

    loadData();
  }, []);

  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello Global Power Church")}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/church_bg.png" 
            alt="Church Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-background z-10" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-pulse z-20" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700 z-20" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-30" />
        </div>

        <div className="container mx-auto px-4 relative z-40 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img 
              src="/images/gpc-logo.png" 
              alt="Global Power Church Logo" 
              className="w-32 h-32 mx-auto rounded-full object-cover mb-8 shadow-2xl border-4 border-secondary/50 p-1 bg-background" 
            />
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm font-semibold rounded-full premium-gradient-secondary text-white border-none shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" /> Welcome to Global Power Church
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter text-white leading-[0.9] [text-shadow:_0_4px_24px_rgba(0,0,0,0.5)]">
              Experience God's <br />
              <span className="text-gradient-primary brightness-150 drop-shadow-2xl">Power & Transformation</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto font-semibold leading-relaxed [text-shadow:_0_2px_12px_rgba(0,0,0,0.3)]">
              Led by Bishop Paul Ndolo Mulu — <br className="md:hidden" />
              <span className="text-secondary italic font-bold">"See, I have this day set thee over the nations..."</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/contact">
                <Button size="lg" className="text-lg px-10 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group">
                  Plan Your Visit <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-10 h-14 rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95">
                  <Play className="h-5 w-5 mr-3 fill-white" /> Watch Online
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 z-40"
        >
          <div className="w-6 h-10 border-2 border-foreground rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-foreground rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats/Service Info Grid */}
      <section className="py-24 px-4 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Join Our Weekly Services</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">Multiple opportunities to connect with God and our community throughout the week.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          >
            {settings.services.map((s, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift bg-background/60 backdrop-blur-sm group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-500">
                      <Calendar className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-500" />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-black text-secondary mb-3 tracking-tighter">{s.time}</p>
                    <p className="text-muted-foreground font-medium leading-relaxed">{s.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      {events.length > 0 && (
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
            >
              <div className="text-left">
                <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 rounded-full font-bold">UPCOMING</Badge>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Special Events & Gatherings</h2>
              </div>
              <Link to="/events">
                <Button variant="link" className="text-primary font-bold text-lg p-0 group">
                  Explore All Events <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {events.map((e) => (
                <motion.div key={e.id} variants={itemVariants}>
                  <Card className="h-full border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden group">
                    <div className="h-48 bg-muted relative overflow-hidden">
                      {e.image ? (
                        <img src={e.image} alt={e.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                          <Users className="w-16 h-16 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-md text-black hover:bg-white border-none shadow-lg px-3 py-1 font-bold">
                          {e.date}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold tracking-tight line-clamp-1">{e.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2 mb-4 font-medium">{e.description || "Join us for this life-changing experience!"}</p>
                      {e.time && (
                        <div className="flex items-center text-sm font-bold text-primary">
                          <Zap className="w-4 h-4 mr-2" /> {e.time}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Sermons Section */}
      {sermons.length > 0 && (
        <section className="py-24 px-4 bg-muted/50">
          <div className="container mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Latest Messages</h2>
              <p className="text-lg text-muted-foreground font-medium">Watch or listen to our most recent spiritual teachings.</p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {sermons.map((s) => (
                <motion.div key={s.id} variants={itemVariants}>
                  <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background group overflow-hidden rounded-3xl">
                    <div className="aspect-video bg-muted relative group overflow-hidden">
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-primary text-white border-none px-3 py-1 font-bold">{s.date}</Badge>
                      </div>
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <Music className="w-12 h-12 text-white/20" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold tracking-tight line-clamp-1">{s.title}</CardTitle>
                      <p className="text-sm font-bold text-primary flex items-center">
                        <Shield className="w-4 h-4 mr-2" /> {s.speaker}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2 mb-6 font-medium">{s.topic || "Spiritual empowerment for your daily walk."}</p>
                      {s.video_url && (
                        <a href={s.video_url} target="_blank" rel="noopener noreferrer" className="block">
                          <Button className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 transition-all shadow-lg shadow-primary/20">
                            Watch Message
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Ministries Grid */}
      <section className="py-24 px-4 bg-background overflow-hidden">
        <div className="container mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Empowering Communities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">Find your purpose and join one of our vibrant ministries today.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {settings.ministries.slice(0, 4).map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link to="/ministries" className="block h-full group">
                  <Card className="h-full border border-border/40 shadow-sm hover:shadow-2xl transition-all duration-500 hover-lift bg-background/50 backdrop-blur-sm rounded-[2rem] p-4">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <CardHeader className="text-center pt-0">
                      <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground font-medium leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Prayer Request CTA - Premium Layout */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 md:p-16 text-center shadow-3xl"
          >
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">Need a Miracle? <br /><span className="text-secondary">We're Praying for You.</span></h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium">Submit your prayer request and our dedicated intercessory team will lift you up before the throne of grace.</p>
              <Link to="/prayer-request">
                <Button size="lg" className="h-16 px-12 rounded-full bg-white text-slate-900 hover:bg-white/90 text-xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95">
                  Submit Prayer Request
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Connect Info */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.a 
              whileHover={{ y: -10 }}
              href={`tel:+${settings.whatsapp}`} 
              className="text-center group p-8 rounded-3xl hover:bg-background hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <Phone className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Call Us</h3>
              <p className="text-lg text-muted-foreground font-semibold group-hover:text-primary transition-colors">{settings.phone}</p>
            </motion.a>
            <motion.a 
              whileHover={{ y: -10 }}
              href={`mailto:${settings.email}`} 
              className="text-center group p-8 rounded-3xl hover:bg-background hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <Mail className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Email Us</h3>
              <p className="text-lg text-muted-foreground font-semibold group-hover:text-primary transition-colors">{settings.email}</p>
            </motion.a>
            <motion.a 
              whileHover={{ y: -10 }}
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-center group p-8 rounded-3xl hover:bg-background hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <MessageSquare className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-black mb-2 tracking-tight">WhatsApp</h3>
              <p className="text-lg text-muted-foreground font-semibold group-hover:text-primary transition-colors">Chat With Us Live</p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Give CTA - Full Width Premium */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-1" />
        
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="h-20 w-20 mx-auto mb-10 text-secondary fill-secondary animate-pulse" />
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white">Support the Kingdom Work</h2>
            <p className="text-2xl mb-12 text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
              Your generosity enables us to reach more lives with the message of God's power and transformation. Partner with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="h-16 px-12 rounded-full text-xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  Give via WhatsApp
                </Button>
              </a>
              <Link to="/give">
                <Button size="lg" className="h-16 px-12 rounded-full text-xl font-black bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95">
                  Giving Options
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
