import { useEffect, useState } from "react";
import apiService from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Globe, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const Notices = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      const response = await apiService.getNotices();
      if (response.data) {
        const data = response.data as any;
        const all = data.results || data || [];
        // Show global notices + branch notices (public view)
        setNotices(all.filter((n: any) => n.is_global || !n.branch_id));
      }
      setLoading(false);
    };
    fetchNotices();
  }, []);

  return (
    <section className="py-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Bell className="h-4 w-4" />
            Church Notices
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Latest <span className="text-primary">Announcements</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Stay updated with the latest news, announcements, and events from Global Power Church.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : notices.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No notices at this time.</p>
              <p className="text-sm text-muted-foreground mt-1">Check back soon for updates.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notices.map((notice, i) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className={`shadow-md hover:shadow-lg transition-shadow ${notice.is_global ? "border-primary/30 bg-primary/5" : ""}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg leading-snug">{notice.title}</CardTitle>
                      <div className="flex gap-2 flex-shrink-0">
                        {notice.is_global ? (
                          <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" />Ministry-Wide
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />Branch
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">{notice.content}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(notice.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notices;
