import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Book, Heart, Phone, Mail, Play, Music, MessageSquare } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useEffect, useState } from "react";
import apiService from "@/services/api";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background pt-16 pb-20 px-4">
        <div className="container mx-auto text-center">
          <img src="/images/gpc-logo.png" alt="Global Power Church Logo" className="w-28 h-28 mx-auto rounded-full object-cover mb-6 shadow-lg border-4 border-secondary" />
          <Badge variant="secondary" className="mb-4">Welcome to Global Power Church</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Experience God's Power & Transformation</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">Led by Bishop Paul Ndolo Mulu — Jeremiah 1:10</p>
          <p className="text-lg text-primary font-semibold mb-8">Daily & Weekly Themes with Spiritual Points</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"><Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground">Plan Your Visit</Button></Link>
            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary text-primary hover:bg-primary/10"><Play className="h-5 w-5 mr-2" />Watch Online</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Service Times from settings */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Join Us This Week</h2>
            <p className="text-lg text-muted-foreground">Multiple services throughout the week</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {settings.services.map((s, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-foreground">
                    <Calendar className="h-5 w-5 text-primary" />{s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-2 text-secondary">{s.time}</p>
                  <p className="text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events from DB */}
      {events.length > 0 && (
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Upcoming Events</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {events.map((e) => (
                <Card key={e.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{e.date}</Badge>
                    <CardTitle className="text-foreground">{e.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{e.description || "Join us for this event!"}</p>
                    {e.time && <p className="text-sm text-primary mt-2">{e.time}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/events"><Button variant="outline" className="border-primary text-primary hover:bg-primary/10">View All Events</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Sermons from DB */}
      {sermons.length > 0 && (
        <section className="py-16 px-4 bg-muted">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Recent Sermons</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {sermons.map((s) => (
                <Card key={s.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{s.date}</Badge>
                    <CardTitle className="text-foreground">{s.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{s.speaker}</p>
                  </CardHeader>
                  <CardContent>
                    {s.topic && <p className="text-muted-foreground mb-2">{s.topic}</p>}
                    {s.video_url && (
                      <a href={s.video_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Play className="h-4 w-4 mr-1" />Watch</Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/sermons"><Button variant="outline" className="border-primary text-primary hover:bg-primary/10">View All Sermons</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* Ministries from settings */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Ministries</h2>
            <p className="text-lg text-muted-foreground">Find your place and grow in faith</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.ministries.slice(0, 4).map((item, i) => (
              <Link to="/ministries" key={i}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/ministries"><Button variant="outline" className="border-primary text-primary hover:bg-primary/10">View All Ministries</Button></Link>
          </div>
        </div>
      </section>

      {/* Prayer Request CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Need Prayer?</h2>
          <p className="text-lg text-muted-foreground mb-8">Submit your prayer request and our team will pray for you</p>
          <Link to="/prayer-request"><Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Prayer Request</Button></Link>
        </div>
      </section>

      {/* Contact from settings */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Get Connected</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a href={`tel:+${settings.whatsapp}`} className="text-center group">
              <Phone className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2 text-foreground">Call Us</h3>
              <p className="text-muted-foreground group-hover:text-primary transition-colors">{settings.phone}</p>
            </a>
            <a href={`mailto:${settings.email}`} className="text-center group">
              <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2 text-foreground">Email Us</h3>
              <p className="text-muted-foreground group-hover:text-primary transition-colors">{settings.email}</p>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-center group">
              <MessageSquare className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2 text-foreground">WhatsApp</h3>
              <p className="text-muted-foreground group-hover:text-primary transition-colors">Chat with us</p>
            </a>
          </div>
        </div>
      </section>

      {/* Give CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <Heart className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Support the Ministry</h2>
          <p className="text-lg mb-8 opacity-90">Partner with Global Power Church through your generous giving</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="secondary">Give via WhatsApp</Button></a>
        </div>
      </section>
    </div>
  );
};

export default Index;
