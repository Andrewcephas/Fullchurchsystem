import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import { useBranches } from "@/hooks/use-branches";
import BranchSelector from "@/components/admin/BranchSelector";

const Notices = () => {
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", is_global: false, branch_id: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

   const fetchNotices = async () => {
     const response = await apiService.getNotices(branchFilter ? { branch_id: branchFilter } : undefined);
     if (response.data) setNotices(response.data.results || response.data);
     setLoading(false);
   };

   useEffect(() => { fetchNotices(); }, [selectedBranch, userBranch]);

   const handleSave = async () => {
     if (!form.title || !form.content) { toast({ title: "Title and content required", variant: "destructive" }); return; }
     const payload: any = {
       title: form.title, content: form.content,
       is_global: isSuperAdmin ? form.is_global : false,
       branch_id: form.is_global ? null : (form.branch_id || userBranch || null)
     };

     if (editId) {
       const response = await apiService.updateNotice(editId, payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Notice updated" });
     } else {
       const response = await apiService.createNotice(payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Notice posted" });
     }
     setForm({ title: "", content: "", is_global: false, branch_id: "" }); setEditId(null); setDialogOpen(false); fetchNotices();
   };

   const handleEdit = (n: any) => {
     setForm({ title: n.title, content: n.content, is_global: n.is_global || false, branch_id: n.branch_id || "" });
     setEditId(n.id); setDialogOpen(true);
   };

   const handleDelete = async (id: string) => {
     const response = await apiService.deleteNotice(id);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Notice deleted" }); fetchNotices();
   };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Notices</h2>
        <div className="flex gap-2 items-center">
          {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); setForm({ title: "", content: "", is_global: false, branch_id: "" }); } }}>
            <DialogTrigger asChild><Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Notice</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Edit Notice" : "Post Notice"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Content *</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} /></div>
                {isSuperAdmin && (
                  <>
                    <div className="flex items-center gap-2">
                      <Switch checked={form.is_global} onCheckedChange={v => setForm({ ...form, is_global: v })} />
                      <Label>Ministry-wide (Global Notice)</Label>
                    </div>
                    {!form.is_global && (
                      <div><Label>Branch</Label>
                        <BranchSelector value={form.branch_id} onChange={v => setForm({ ...form, branch_id: v })} showAll={false} />
                      </div>
                    )}
                  </>
                )}
                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">{editId ? "Update" : "Post"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />All Notices</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : notices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No notices yet.</p>
          ) : (
            <div className="space-y-4">
              {notices.map(n => (
                <div key={n.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{n.title}</h3>
                        {n.is_global && <Badge className="bg-primary text-primary-foreground">Global</Badge>}
                      </div>
                      <p className="text-sm text-foreground">{n.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(n)}><Pencil className="h-4 w-4 text-primary" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notices;
