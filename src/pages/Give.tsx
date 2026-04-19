import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Play, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const Give = () => {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello, I would like to partner with Global Power Church through giving")}`;

  return (
    <div className="min-h-screen bg-background pt-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_70%)]" />
        <div className="container mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight gradient-text">
            Partner with Us
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Your generosity fuels our mission to reach souls, transform lives, and spread the Gospel across the nations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105">
                Give via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-card border-none p-12 text-center relative overflow-hidden group hover-lift">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="relative z-10">
              <p className="text-2xl md:text-3xl font-medium text-foreground italic mb-6 leading-relaxed">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
              </p>
              <div className="h-1 w-20 bg-primary/20 mx-auto mb-4" />
              <p className="text-primary font-bold tracking-widest uppercase text-sm">2 Corinthians 9:7</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Giving Methods */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">How to Give</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Tithes & Offerings", desc: "Regular support for the local church and its ongoing ministries.", icon: <Heart className="h-6 w-6" /> },
              { title: "Mission & Crusades", desc: "Special support for our outreach programs and soul-winning missions.", icon: <Play className="h-6 w-6" /> },
              { title: "Building Fund", desc: "Contributing to the growth and maintenance of our physical worship spaces.", icon: <ExternalLink className="h-6 w-6" /> }
            ].map((item, i) => (
              <Card key={i} className="glass-card border-none p-8 hover-lift group">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary text-primary group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {item.desc}
                </p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="link" className="p-0 text-primary font-bold hover:no-underline group-hover:translate-x-1 transition-transform">
                    Give Now &rarr;
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 px-4 relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Every Gift Matters</h2>
          <p className="text-xl mb-12 opacity-80 leading-relaxed">
            Through your partnership, Global Power Church continues to witness thousands of lives being touched by the power of God. Together, we are building an eternal legacy.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" className="rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">
              Become a Partner
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Give;
