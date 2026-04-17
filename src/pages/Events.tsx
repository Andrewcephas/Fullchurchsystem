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
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello, I want to know more about events")}`;

  useEffect(() => {
    const loadEvents = async () => {
      const response = await apiService.getEvents({ ordering: '-date' });
      if (response.data) {
        setDbEvents(response.data.results || response.data);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Events & Services</h1>
          <p className="text-xl text-muted-foreground mb-8">Join us for weekly services and special events</p>
          <p className="text-lg text-primary font-semibold">Daily & Weekly Themes with Spiritual Points</p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Weekly Services</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {settings.services.map((e, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-foreground">{e.title}</CardTitle>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{e.day}</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{e.time}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{e.description}</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Get Directions</Button></a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {dbEvents.length > 0 && (
        <section className="py-16 px-4 bg-muted">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {dbEvents.map((e) => (
                <Card key={e.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{e.date}</Badge>
                    <CardTitle className="text-foreground">{e.title}</CardTitle>
                    {e.time && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-primary" />{e.time}</div>}
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{e.description || "Join us!"}</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Learn More</Button></a>
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
