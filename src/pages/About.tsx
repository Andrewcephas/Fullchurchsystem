import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, Book } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">About Global Power Church</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A spirit-filled ministry led by Bishop Paul Ndolo Mulu, dedicated to transforming lives through the power of God.
          </p>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { to: "/about/our-story", icon: Book, title: "Our Story", desc: "The journey of Global Power Church", text: "Discover how Bishop Paul Ndolo Mulu founded this ministry.", btn: "Read Our Story" },
              { to: "/about/mission", icon: Heart, title: "Mission & Vision", desc: "Our purpose and direction", text: "Learn about our mission to spread God's power.", btn: "Our Mission" },
              { to: "/about/leadership", icon: Users, title: "Leadership", desc: "Meet Bishop Paul Ndolo Mulu", text: "Get to know our Bishop and ministry leaders.", btn: "Meet Our Team" },
            ].map((item, i) => (
              <Link to={item.to} key={i}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="text-center">
                    <item.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-foreground">{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center mb-4">{item.text}</p>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">{item.btn}</Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Power", desc: "We believe in the transformative power of the Holy Spirit" },
              { title: "Faith", desc: "Walking by faith and trusting God in all things" },
              { title: "Community", desc: "Growing together as a family of believers" },
              { title: "Service", desc: "Serving God by serving others with love" },
            ].map((v, i) => (
              <Card key={i} className="text-center">
                <CardHeader><CardTitle className="text-primary">{v.title}</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">{v.desc}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
