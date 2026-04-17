import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Book, Globe } from "lucide-react";

const Mission = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Mission & Vision</h1>
          <p className="text-xl text-muted-foreground mb-8">Our God-given purpose and direction</p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Our Mission</h2>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8">
                <p className="text-xl text-foreground leading-relaxed">"To demonstrate God's power, transform lives through the Gospel of Jesus Christ, and raise a generation of empowered believers."</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Worship God", desc: "We worship with passion and power." },
              { icon: Users, title: "Build Community", desc: "We nurture authentic relationships." },
              { icon: Book, title: "Teach the Word", desc: "We equip believers with Scripture." },
              { icon: Globe, title: "Reach the World", desc: "We spread the gospel globally." },
            ].map((item, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader><item.icon className="h-12 w-12 mx-auto mb-4 text-primary" /><CardTitle className="text-foreground">{item.title}</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">{item.desc}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Our Vision</h2>
          <Card><CardContent className="p-8">
            <p className="text-xl text-foreground leading-relaxed mb-6">"To be a powerhouse of God's glory — a church where every believer walks in divine power, purpose, and destiny."</p>
            <p className="text-lg text-muted-foreground">Under Bishop Paul Ndolo Mulu's leadership, we envision a church that raises leaders and transforms communities.</p>
          </CardContent></Card>
        </div>
      </section>
    </div>
  );
};

export default Mission;
