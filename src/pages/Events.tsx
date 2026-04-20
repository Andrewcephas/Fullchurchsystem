import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useEffect, useState } from "react";
import apiService from "@/services/api";
import { motion } from "framer-motion";

const Events = () => {
  const { settings } = useSiteSettings();
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello, I want to know more about events at Global Power Church")}`;

  useEffect(() => {
    const loadEvents = async () => {
      const response = await apiService.getEvents({ ordering: '-event_date' });
      if (response.data) {
        setDbEvents(response.data.results || response.data);
      }
    };

    loadEvents();
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
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold">FAITH IN ACTION</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-tight">Events & <span className="text-gradient-primary">Spiritual Services</span></h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Join us for powerful weekly services and life-changing special events as we experience God together.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 rounded-full text-secondary font-black text-sm uppercase tracking-widest border border-secondary/20">
              <Sparkles className="w-5 h-5" /> Daily & Weekly Spiritual Themes
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
            <h2 className="text-4xl font-black tracking-tight mb-4">Weekly Schedule</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {settings.services.map((e, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift bg-background p-2 rounded-[2rem] overflow-hidden group">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="sm:w-1/3 bg-primary/5 p-8 flex flex-col items-center justify-center text-center group-hover:bg-primary transition-colors duration-500 rounded-[1.5rem]">
                      <Calendar className="h-8 w-8 text-primary mb-2 group-hover:text-white" />
                      <span className="text-xl font-black text-primary group-hover:text-white">{e.day}</span>
                    </div>
                    <div className="flex-1 p-8">
                      <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest mb-2">
                        <Clock className="h-4 w-4" /> {e.time}
                      </div>
                      <CardTitle className="text-2xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors">{e.title}</CardTitle>
                      <p className="text-muted-foreground font-medium mb-6 line-clamp-2">{e.description}</p>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full rounded-xl bg-muted text-foreground hover:bg-primary hover:text-white border-none font-bold group-hover:shadow-lg transition-all">
                          <MapPin className="mr-2 h-4 w-4" /> Get Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {dbEvents.length > 0 && (
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-black tracking-tight mb-4">Upcoming Gatherings</h2>
              <p className="text-muted-foreground font-medium">Mark your calendars for these special ministry dates.</p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {dbEvents.map((e) => (
                <motion.div key={e.id} variants={itemVariants}>
                  <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-muted/20 p-6 rounded-[2rem] hover-lift group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                      <Badge className="bg-primary/10 text-primary border-none font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                        {e.date ? new Date(e.date).toLocaleDateString() : 'Upcoming'}
                      </Badge>
                    </div>
                    <div className="mt-8">
                      <CardTitle className="text-2xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors line-clamp-1">{e.title}</CardTitle>
                      {e.date && (
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4">
                          <Clock className="h-4 w-4 text-secondary" /> {new Date(e.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      )}
                      <p className="text-muted-foreground font-medium mb-8 leading-relaxed line-clamp-3">{e.description || "Don't miss out on this life-changing spiritual encounter with the Global Power Church family."}</p>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full rounded-2xl bg-white text-foreground hover:bg-primary hover:text-white border border-border group-hover:border-transparent font-bold h-12 shadow-sm transition-all">
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;
