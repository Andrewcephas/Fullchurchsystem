import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Check, Eye, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import apiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
import BranchSelector from "@/components/admin/BranchSelector";

const PrayerRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", request: "" });
  const { toast } = useToast();
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const [selectedBranch, setSelectedBranch] = useState("all");

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

  const fetchRequests = async () => {
    const response = await apiService.getPrayerRequests(branchFilter ? { branch_id: branchFilter } : undefined);
    if (response.data) setRequests(response.data.results || response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedBranch, userBranch]);

  const updateStatus = async (id: string, status: string) => {
    const response = await apiService.updatePrayerRequest(id, { status });
    if (response.error) {
      toast({ title: "Error", variant: "destructive" });
      return;
    }
    toast({ title: `Marked as ${status}` });
    fetchRequests();
  };

  const handleCreate = async () => {
    if (!form.name || !form.request) {
      toast({ title: "Name and request required", variant: "destructive" });
      return;
    }
    const payload = { ...form, branch_id: userBranch };
    const response = await apiService.createPrayerRequest(payload);
    if (response.error) {
      toast({ title: "Error", description: response.error, variant: "destructive" });
      return;
    }
    toast({ title: "Request added" });
    setForm({ name: "", email: "", request: "" });
    setDialogOpen(false);
    fetchRequests();
  };

  const handleDelete = async (id: string) => {
    const response = await apiService.deletePrayerRequest(id);
    if (response.error) {
      toast({ title: "Error", variant: "destructive" });
      return;
    }
    toast({ title: "Request deleted" });
    fetchRequests();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Prayer Requests</h2>
        <div className="flex gap-2 items-center">
          {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Prayer Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label>Request *</Label>
                  <Textarea value={form.request} onChange={(e) => setForm({ ...form, request: e.target.value })} />
                </div>
                <Button onClick={handleCreate} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-muted-foreground">No prayer requests yet.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-4 w-4 text-primary" />
                      {r.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {r.email || "No email"} • {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={r.status === "new" ? "default" : r.status === "praying" ? "secondary" : "outline"}>
                    {r.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{r.request}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "praying")}>
                    <Eye className="h-3 w-3 mr-1" />
                    Mark Praying
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "answered")}>
                    <Check className="h-3 w-3 mr-1" />
                    Mark Answered
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
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
