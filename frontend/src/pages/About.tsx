import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, Book, Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-bold">OUR JOURNEY</Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground">About <span className="text-gradient-primary">Global Power Church</span></h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
              A spirit-filled ministry led by Bishop Paul Ndolo Mulu, dedicated to transforming lives through the power of God.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { to: "/about/our-story", icon: Book, title: "Our Story", desc: "The journey of Global Power Church", text: "Discover how Bishop Paul Ndolo Mulu founded this ministry and the miracles along the way.", btn: "Read Our Story", color: "bg-blue-500/10 text-blue-500" },
              { to: "/about/mission", icon: Heart, title: "Mission & Vision", desc: "Our purpose and direction", text: "Learn about our clear mission to spread God's power and transform communities globally.", btn: "Our Mission", color: "bg-red-500/10 text-red-500" },
              { to: "/about/leadership", icon: Users, title: "Leadership", desc: "Meet Bishop Paul Ndolo Mulu", text: "Get to know our Bishop and the dedicated team leading this powerful spiritual movement.", btn: "Meet Our Team", color: "bg-primary/10 text-primary" },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link to={item.to} className="block h-full group">
                  <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift bg-background p-4 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="text-center">
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                        <item.icon className="h-10 w-10" />
                      </div>
                      <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{item.title}</CardTitle>
                      <CardDescription className="font-bold text-muted-foreground/60">{item.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground font-medium leading-relaxed mb-8">{item.text}</p>
                      <Button className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 group">
                        {item.btn} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Our Core Values</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { title: "Power", desc: "We believe in the transformative power of the Holy Spirit to change any situation.", icon: Zap },
              { title: "Faith", desc: "Walking by faith and trusting God in all things, for without faith it is impossible to please Him.", icon: Shield },
              { title: "Community", desc: "Growing together as a family of believers, supporting each other in our spiritual journey.", icon: Users },
              { title: "Service", desc: "Serving God by serving others with love, humility, and excellence in all we do.", icon: Heart },
            ].map((v, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="text-center h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-muted/30 p-6 rounded-[2rem] hover-lift group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <v.icon className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-black tracking-tight">{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-muted-foreground font-medium leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const Badge = ({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) => (
  <div className={`inline-flex items-center px-3 py-1 text-xs font-bold transition-colors ${className}`}>
    {children}
  </div>
);

export default About;
