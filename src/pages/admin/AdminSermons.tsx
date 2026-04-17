import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Book, Trash2, Pencil, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import { useBranches } from "@/hooks/use-branches";
import BranchSelector from "@/components/admin/BranchSelector";

const emptyForm = { title: "", speaker: "Bishop Paul Ndolo Mulu", date: "", video_url: "", topic: "", branch_id: "" };

const AdminSermons = () => {
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [sermons, setSermons] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

   const fetchSermons = async () => {
     const response = await apiService.getSermons(branchFilter ? { branch_id: branchFilter } : undefined);
     if (response.data) setSermons(response.data.results || response.data);
     setLoading(false);
   };

   useEffect(() => { fetchSermons(); }, [selectedBranch, userBranch]);

   const handleSave = async () => {
     if (!form.title || !form.date) { toast({ title: "Title and date required", variant: "destructive" }); return; }
     const payload = { title: form.title, speaker: form.speaker, date: form.date, video_url: form.video_url, topic: form.topic, branch_id: form.branch_id || userBranch || null };

     if (editId) {
       const response = await apiService.updateSermon(editId, payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Sermon updated" });
     } else {
       const response = await apiService.createSermon(payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Sermon added" });
     }
     setForm(emptyForm); setEditId(null); setDialogOpen(false); fetchSermons();
   };

   const handleEdit = (s: any) => {
     setForm({ title: s.title, speaker: s.speaker || "", date: s.date, video_url: s.video_url || "", topic: s.topic || "", branch_id: s.branch_id || "" });
     setEditId(s.id); setDialogOpen(true);
   };

   const handleDelete = async (id: string) => {
     const response = await apiService.deleteSermon(id);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Sermon deleted" }); fetchSermons();
   };

  const filtered = sermons.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || (s.speaker || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search sermons..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild><Button onClick={() => { setForm(emptyForm); setEditId(null); setDialogOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Sermon</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit Sermon" : "Add Sermon"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>Speaker</Label><Input value={form.speaker} onChange={e => setForm({...form, speaker: e.target.value})} /></div>
              <div><Label>Date *</Label><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div><Label>Topic</Label><Input value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} /></div>
              <div><Label>Video URL</Label><Input value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} placeholder="https://youtube.com/..." /></div>
              {isSuperAdmin && (
                <div><Label>Branch</Label>
                  <Select value={form.branch_id} onValueChange={v => setForm({...form, branch_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">{editId ? "Update" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Book className="h-5 w-5 text-primary" />Sermons</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : filtered.length === 0 ? <p className="text-center text-muted-foreground py-8">No sermons yet.</p> : (
            <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Title</TableHead><TableHead>Speaker</TableHead><TableHead>Topic</TableHead><TableHead>Link</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>{filtered.map(s => (<TableRow key={s.id}><TableCell>{s.date}</TableCell><TableCell className="font-medium">{s.title}</TableCell><TableCell>{s.speaker}</TableCell><TableCell>{s.topic || "—"}</TableCell><TableCell>{s.video_url ? <a href={s.video_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Watch</a> : "—"}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4 text-primary" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell></TableRow>))}</TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSermons;
