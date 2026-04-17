import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

const Leadership = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Our Leadership</h1>
          <p className="text-xl text-muted-foreground mb-8">Meet the anointed leaders who guide Global Power Church</p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img src="/images/gpc-logo.jpg" alt="Bishop Paul Ndolo Mulu" className="w-24 h-24 rounded-full object-cover border-4 border-secondary" />
                <div className="text-center md:text-left">
                  <CardTitle className="text-2xl text-foreground">Bishop Paul Ndolo Mulu</CardTitle>
                  <p className="text-primary font-medium text-lg">Founder & Senior Bishop</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">Bishop Paul Ndolo Mulu is the founder and spiritual leader of Global Power Church. Called by God to demonstrate His power and transform lives, Bishop Mulu has dedicated his life to preaching the uncompromised Gospel.</p>
              <div className="space-y-2">
                <a href="mailto:paulndolo1972@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"><Mail className="h-4 w-4 text-primary" />paulndolo1972@gmail.com</a>
                <a href="tel:+254704129211" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"><Phone className="h-4 w-4 text-primary" />0704 129 211</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Ministry Leaders</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { dept: "Choir Ministry", role: "Choir Director" },
              { dept: "Praise & Worship", role: "Worship Leader" },
              { dept: "Dance Ministry", role: "Dance Coordinator" },
              { dept: "Youth Ministry", role: "Youth Leader" },
              { dept: "Women Ministry", role: "Women Leader" },
              { dept: "Men Ministry", role: "Men Leader" },
              { dept: "Hospitality", role: "Hospitality Coordinator" },
              { dept: "Crusades & Outreach", role: "Outreach Director" },
            ].map((leader, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2"><span className="text-primary font-bold">{leader.dept[0]}</span></div>
                  <CardTitle className="text-lg text-foreground">{leader.dept}</CardTitle>
                </CardHeader>
                <CardContent><p className="text-primary font-medium">{leader.role}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
