import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Trash2, Pencil, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import { useBranches } from "@/hooks/use-branches";
import BranchSelector from "@/components/admin/BranchSelector";

const emptyForm = { title: "", date: "", time: "", description: "", branch_id: "", is_conference: false };

const AdminEvents = () => {
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const { toast } = useToast();

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

   const fetchEvents = async () => {
     const filters: any = {};
     if (branchFilter) {
       // For events, we want branch-specific OR conference events
       // This might need special handling in the API, for now we'll just filter by branch
       filters.branch_id = branchFilter;
     }
     const response = await apiService.getEvents(filters);
     if (response.data) setEvents(response.data.results || response.data);
     setLoading(false);
   };

   useEffect(() => { fetchEvents(); }, [selectedBranch, userBranch]);

   const handleSave = async () => {
     if (!form.title || !form.date) { toast({ title: "Title and date required", variant: "destructive" }); return; }
     const payload: any = {
       title: form.title, date: form.date, time: form.time, description: form.description,
       is_conference: isSuperAdmin ? form.is_conference : false,
       branch_id: form.is_conference ? null : (form.branch_id || userBranch || null)
     };

     if (editId) {
       const response = await apiService.updateEvent(editId, payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Event updated" });
     } else {
       const response = await apiService.createEvent(payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Event created" });
     }
     setForm(emptyForm); setEditId(null); setDialogOpen(false); fetchEvents();
   };

   const handleEdit = (e: any) => {
     setForm({ title: e.title, date: e.date, time: e.time || "", description: e.description || "", branch_id: e.branch_id || "", is_conference: e.is_conference || false });
     setEditId(e.id); setDialogOpen(true);
   };

   const handleDelete = async (id: string) => {
     const response = await apiService.deleteEvent(id);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Event deleted" }); fetchEvents();
   };

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchDate = !filterDate || e.date === filterDate;
    return matchSearch && matchDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-[160px]" placeholder="Filter by date" />
          {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild><Button onClick={() => { setForm(emptyForm); setEditId(null); setDialogOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Event</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit Event" : "Create Event"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>Date *</Label><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div><Label>Time</Label><Input value={form.time} onChange={e => setForm({...form, time: e.target.value})} placeholder="e.g. 10:00 AM" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              {isSuperAdmin && (
                <>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_conference} onCheckedChange={v => setForm({...form, is_conference: v})} />
                    <Label>Conference Event (visible to all branches)</Label>
                  </div>
                  {!form.is_conference && (
                    <div><Label>Branch</Label>
                      <Select value={form.branch_id} onValueChange={v => setForm({...form, branch_id: v})}>
                        <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                        <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">{editId ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Events</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : filtered.length === 0 ? <p className="text-center text-muted-foreground py-8">No events yet.</p> : (
            <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Title</TableHead><TableHead>Time</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>{filtered.map(e => (<TableRow key={e.id}><TableCell>{e.date}</TableCell><TableCell className="font-medium">{e.title}</TableCell><TableCell>{e.time || "—"}</TableCell><TableCell>{e.is_conference ? <Badge className="bg-primary text-primary-foreground">Conference</Badge> : <Badge variant="secondary">Branch</Badge>}</TableCell><TableCell className="text-muted-foreground max-w-[200px] truncate">{e.description || "—"}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => handleEdit(e)}><Pencil className="h-4 w-4 text-primary" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell></TableRow>))}</TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEvents;
