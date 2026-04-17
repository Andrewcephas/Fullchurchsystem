import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useEffect, useState } from "react";
import apiService from "@/services/api";

const Sermons = () => {
  const { settings } = useSiteSettings();
  const [sermons, setSermons] = useState<any[]>([]);

  useEffect(() => {
    const loadSermons = async () => {
      const response = await apiService.getSermons({ ordering: '-date' });
      if (response.data) {
        setSermons(response.data.results || response.data);
      }
    };

    loadSermons();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">Sermons</h1>
          <p className="text-xl text-muted-foreground mb-4">Be encouraged by powerful sermons from Bishop Paul Ndolo Mulu</p>
          <p className="text-lg text-primary font-semibold mb-8">Daily & Weekly Themes with Spiritual Points</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"><Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Play className="h-5 w-5 mr-2" />Watch on YouTube</Button></a>
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10"><ExternalLink className="h-5 w-5 mr-2" />Join Facebook Group</Button></a>
          </div>
        </div>
      </section>

      {sermons.length > 0 ? (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">All Sermons</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((s) => (
                <Card key={s.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-2">{s.date}</Badge>
                    <h3 className="text-lg font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{s.speaker}</p>
                    {s.topic && <p className="text-sm text-primary mb-3">{s.topic}</p>}
                    {s.video_url ? (
                      <a href={s.video_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"><Play className="h-4 w-4 mr-1" />Watch</Button>
                      </a>
                    ) : (
                      <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="w-full border-primary text-primary">View on YouTube</Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Latest Sermons</h2>
            <Card className="mb-8"><CardContent className="p-0">
              <div className="w-full aspect-video bg-foreground/5 rounded-t-lg overflow-hidden">
                <iframe className="w-full h-full" src="https://www.youtube.com/embed?listType=user_uploads&list=GLOBALPOWERCHURCH" title="GPC Sermons" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="p-6 text-center">
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"><Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Play className="h-5 w-5 mr-2" />View All on YouTube</Button></a>
              </div>
            </CardContent></Card>
          </div>
        </section>
      )}

      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Where to Watch & Connect</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow"><CardContent className="p-8 text-center">
              <Play className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-foreground mb-2">YouTube</h3>
              <p className="text-muted-foreground mb-6">Watch live services and sermons.</p>
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"><Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button></a>
            </CardContent></Card>
            <Card className="hover:shadow-lg transition-shadow"><CardContent className="p-8 text-center">
              <ExternalLink className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-foreground mb-2">Facebook Group</h3>
              <p className="text-muted-foreground mb-6">Join our community for discussions and prayer.</p>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"><Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Join Group</Button></a>
            </CardContent></Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sermons;
