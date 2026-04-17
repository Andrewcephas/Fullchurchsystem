import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Check, Eye } from "lucide-react";
import apiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const PrayerRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

   const fetchRequests = async () => {
     const response = await apiService.getPrayerRequests();
     if (response.data) setRequests(response.data.results || response.data);
     setLoading(false);
   };

   useEffect(() => { fetchRequests(); }, []);

   const updateStatus = async (id: string, status: string) => {
     const response = await apiService.updatePrayerRequest(id, { status });
     if (response.error) { toast({ title: "Error", variant: "destructive" }); return; }
     toast({ title: `Marked as ${status}` });
     fetchRequests();
   };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Prayer Requests</h2>
      {loading ? <p className="text-muted-foreground">Loading...</p> : requests.length === 0 ? <p className="text-muted-foreground">No prayer requests yet.</p> : (
        <div className="grid gap-4">
          {requests.map(r => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2"><Heart className="h-4 w-4 text-primary" />{r.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{r.email || "No email"} • {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={r.status === "new" ? "default" : r.status === "praying" ? "secondary" : "outline"}>{r.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{r.request}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "praying")}><Eye className="h-3 w-3 mr-1" />Mark Praying</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "answered")}><Check className="h-3 w-3 mr-1" />Mark Answered</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrayerRequests;
