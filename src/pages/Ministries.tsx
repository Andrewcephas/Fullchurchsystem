import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const Ministries = () => {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello, I want to learn more about ministries")}`;

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Ministries</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Find your place of service and grow in God's power</p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {settings.ministries.map((m, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2"><Users className="h-8 w-8 text-primary" /><CardTitle className="text-foreground">{m.title}</CardTitle></div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-4 flex-1">{m.description}</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Join {m.title}</Button></a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Ready to Get Involved?</h2>
          <Card><CardContent className="p-8">
            <p className="text-lg text-muted-foreground mb-6">Every member has a God-given gift and a place to serve.</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Contact Us on WhatsApp</Button></a>
          </CardContent></Card>
        </div>
      </section>
    </div>
  );
};

export default Ministries;
