import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";
import BranchSelector from "@/components/admin/BranchSelector";

const Communications = () => {
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const { toast } = useToast();

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

  const fetchHistory = async () => {
    let q = supabase.from("communications").select("*").order("created_at", { ascending: false });
    if (branchFilter) q = q.eq("branch_id", branchFilter);
    const { data } = await q;
    if (data) setHistory(data);
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, [selectedBranch, userBranch]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("communications").insert({ message, user_id: user.id, branch_id: userBranch || null });
    setMessage(""); toast({ title: "Announcement saved" }); fetchHistory();
  };

  const handleUpdate = async () => {
    if (!editMessage.trim() || !editId) return;
    await supabase.from("communications").update({ message: editMessage }).eq("id", editId);
    setEditOpen(false); setEditId(null); toast({ title: "Updated" }); fetchHistory();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("communications").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchHistory();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Communications</h2>
        {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" />Send Announcement</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Message</Label><Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your announcement..." rows={4} /></div>
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Send className="h-4 w-4 mr-2" />Send</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>History</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground text-center py-4">Loading...</p> : history.length === 0 ? <p className="text-muted-foreground text-center py-4">No announcements.</p> : (
            <div className="space-y-3">{history.map(h => (
              <div key={h.id} className="p-3 bg-muted rounded-md">
                <p className="text-sm text-foreground">{h.message}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditId(h.id); setEditMessage(h.message); setEditOpen(true); }}><Pencil className="h-3 w-3 text-primary" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(h.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </div>
              </div>
            ))}</div>
          )}
        </CardContent>
      </Card>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Textarea value={editMessage} onChange={e => setEditMessage(e.target.value)} rows={4} />
            <Button onClick={handleUpdate} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Communications;
