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
      const response = await apiService.getSermons({ ordering: '-sermon_date' });
      if (response.data) {
        setSermons(response.data.results || response.data);
      }
    };

    loadSermons();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight gradient-text">
            Spiritual Nourishment
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the transformative word of God through Bishop Paul Ndolo Mulu's powerful teachings.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-float">
            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                <Play className="h-5 w-5 mr-2" /> Watch Live
              </Button>
            </a>
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary/5">
                <ExternalLink className="h-5 w-5 mr-2" /> Connect on Facebook
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-foreground">Latest Messages</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent ml-8 hidden md:block" />
          </div>

          {sermons.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons.map((s, idx) => (
                <div 
                  key={s.id} 
                  className="group relative"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Card className="glass-card overflow-hidden hover-lift h-full flex flex-col border-none">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {s.video_url ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-300 z-20" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Badge variant="outline" className="text-primary border-primary/20 capitalize">
                            {s.category || "General"}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-3">
                          {s.sermon_date ? new Date(s.sermon_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {s.description || "Join us for a powerful message that will uplift your spirit and transform your life."}
                      </p>
                      <div className="mt-auto pt-4 border-t border-primary/10 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {s.speaker || "Bishop Paul Ndolo Mulu"}
                        </span>
                        {s.video_url && (
                          <a href={s.video_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center text-sm font-semibold">
                            Watch <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card className="glass-card border-none p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No Sermons Found</h3>
                <p className="text-muted-foreground mb-8">
                  We're currently updating our message library. In the meantime, you can explore our entire collection on YouTube.
                </p>
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full bg-primary text-primary-foreground">
                    Visit YouTube Channel
                  </Button>
                </a>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Connection Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.02] -skew-y-3" />
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-12 tracking-tight">Stay Connected Everywhere</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card hover-lift border-none p-8 text-left group">
              <div className="h-14 w-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">GPC YouTube</h3>
              <p className="text-muted-foreground mb-6">
                Never miss a service. Join thousands of believers worldwide for our live broadcasts and archived sermons.
              </p>
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 font-bold hover:bg-transparent">
                  Subscribe Now &rarr;
                </Button>
              </a>
            </Card>
            <Card className="glass-card hover-lift border-none p-8 text-left group">
              <div className="h-14 w-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ExternalLink className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Community Hub</h3>
              <p className="text-muted-foreground mb-6">
                Join our Facebook group for daily encouragement, shared testimonies, and direct interaction with our community.
              </p>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 font-bold hover:bg-transparent">
                  Join the Group &rarr;
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sermons;
