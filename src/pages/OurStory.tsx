import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Heart, Book } from "lucide-react";

const OurStory = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Our Story</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">The journey of Global Power Church — founded on faith, built by God's power</p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">How It All Began</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">Global Power Church was founded by Bishop Paul Ndolo Mulu with a divine mandate to spread the gospel and demonstrate God's power.</p>
          </div>
          <div className="space-y-8">
            {[
              { icon: Calendar, title: "The Foundation", text: "Bishop Paul Ndolo Mulu received a calling from God to establish a ministry that would bring God's power to the people." },
              { icon: Users, title: "Growing Community", text: "As God's power manifested through healing and transformed lives, the church grew rapidly with multiple ministries." },
              { icon: Heart, title: "Crusades & Conferences", text: "The church expanded through powerful crusades and yearly conferences, reaching thousands." },
              { icon: Book, title: "Digital Ministry", text: "Global Power Church now streams services on YouTube and connects with believers worldwide." },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader><CardTitle className="flex items-center gap-3 text-foreground"><item.icon className="h-6 w-6 text-primary" />{item.title}</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">{item.text}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Become Part of Our Story</h2>
          <p className="text-lg opacity-90">God is still writing amazing chapters through Global Power Church.</p>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
