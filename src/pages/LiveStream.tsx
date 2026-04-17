import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Clock, ExternalLink } from "lucide-react";

const YOUTUBE_URL = "https://www.youtube.com/@GLOBALPOWERCHURCH";
const FACEBOOK_URL = "https://www.facebook.com/groups/1202497280341977";

const LiveStream = () => {
  const services = [
    { title: "Sunday Main Service", day: "Every Sunday", time: "Main Service", speaker: "Bishop Paul Ndolo Mulu" },
    { title: "Thursday Prayers", day: "Every Thursday", time: "4:00 – 6:00 PM", speaker: "Bishop Paul Ndolo Mulu" },
    { title: "Friday Kesha", day: "Every Friday", time: "Night Service", speaker: "Bishop Paul Ndolo Mulu" },
    { title: "Saturday Devotion", day: "Every Saturday", time: "6:00 – 7:00 AM", speaker: "Bishop Paul Ndolo Mulu" },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Watch Live</h1>
          <p className="text-xl text-muted-foreground mb-8">Join Global Power Church online — experience God's power from anywhere</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"><Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Play className="h-5 w-5 mr-2" />Watch on YouTube</Button></a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10"><ExternalLink className="h-5 w-5 mr-2" />Join Facebook Group</Button></a>
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="mb-8"><CardContent className="p-0">
            <div className="w-full aspect-video bg-foreground/5 rounded-t-lg overflow-hidden">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed?listType=user_uploads&list=GLOBALPOWERCHURCH" title="GPC Live" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="text-xl font-bold text-foreground">Global Power Church Live</h3><p className="text-muted-foreground">Bishop Paul Ndolo Mulu</p></div>
                <Badge variant="secondary">YouTube</Badge>
              </div>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"><Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"><Play className="h-4 w-4 mr-2" />Open YouTube Channel</Button></a>
            </div>
          </CardContent></Card>
        </div>
      </section>
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Service Schedule</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {services.map((s, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center"><CardTitle className="text-foreground text-lg">{s.title}</CardTitle></CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm"><Calendar className="h-4 w-4 text-primary" />{s.day}</div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm"><Clock className="h-4 w-4 text-primary" />{s.time}</div>
                  <p className="text-sm text-primary font-medium">{s.speaker}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Can't Join Us in Person?</h2>
          <p className="text-lg mb-8 opacity-90">Watch our services live on YouTube and connect through Facebook.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="secondary">Subscribe on YouTube</Button></a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">Join Facebook Group</Button></a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiveStream;
