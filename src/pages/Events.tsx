import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useEffect, useState } from "react";
import apiService from "@/services/api";

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

  return (
    <div className="min-h-screen bg-background pt-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4 rounded-full px-4 py-1 bg-primary/10 text-primary border-primary/20 animate-float">
            Gather with us
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight gradient-text">
            Events & Services
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join our vibrant community as we celebrate, worship, and grow together in spirit and truth.
          </p>
        </div>
      </section>

      {/* Weekly Services */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground shrink-0">Weekly Services</h2>
            <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {settings.services.map((e, i) => (
              <Card key={i} className="glass-card border-none overflow-hidden group hover-lift">
                <div className="p-8 flex gap-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-2xl flex flex-col items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-6 w-6 text-primary mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">{e.day.substring(0, 3)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{e.title}</h3>
                      <Badge variant="outline" className="border-primary/20 text-primary">Weekly</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-secondary" /> {e.time}</div>
                      <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-secondary" /> {e.day}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {e.description}
                    </p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 font-bold hover:bg-transparent">
                        Get Directions &rarr;
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {dbEvents.length > 0 && (
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-secondary/[0.02] skew-y-3" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex items-center gap-4 mb-12 flex-row-reverse">
              <h2 className="text-3xl font-bold text-foreground shrink-0">Special Events</h2>
              <div className="h-px w-full bg-gradient-to-l from-primary/20 to-transparent" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {dbEvents.map((e, idx) => (
                <Card 
                  key={e.id} 
                  className="glass-card border-none overflow-hidden hover-lift flex flex-col"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/20 backdrop-blur-md border-white/20 text-white font-bold">
                        {e.event_date ? new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Soon"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-foreground mb-3">{e.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      {e.time && <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" />{e.time}</div>}
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" />{e.event_date ? new Date(e.event_date).toLocaleDateString() : "TBD"}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3">
                      {e.description || "Be part of this transformative encounter at Global Power Church. We look forward to seeing you there."}
                    </p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        Join Event
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;
