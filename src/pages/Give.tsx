import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const Give = () => {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello, I would like to give to Global Power Church")}`;

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Give</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Partner with Global Power Church in advancing God's kingdom</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Heart className="h-5 w-5 mr-2" />Give Now via WhatsApp</Button>
          </a>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Why We Give</h2>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8">
                <p className="text-lg text-foreground leading-relaxed mb-4">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."</p>
                <p className="text-primary font-medium">— 2 Corinthians 9:7</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Heart className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Give via WhatsApp</h3>
                <p className="text-muted-foreground mb-6">Send a message via WhatsApp to receive giving instructions.</p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Send WhatsApp Message</Button></a>
                <p className="text-sm text-muted-foreground mt-4">WhatsApp: {settings.phone}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Your Giving Makes a Difference</h2>
          <p className="text-lg mb-8 opacity-90">Through your generosity, Global Power Church conducts crusades, holds conferences, and reaches more souls for Christ.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="secondary">Give Now</Button></a>
        </div>
      </section>
    </div>
  );
};

export default Give;
