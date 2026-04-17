import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ClipboardCheck, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import { useBranches } from "@/hooks/use-branches";
import BranchSelector from "@/components/admin/BranchSelector";

const services = ["Sunday Service", "Thursday Prayers", "Friday Kesha", "Saturday Devotion", "Special Event"];
const emptyForm = { service: "", date: "", count: "", notes: "", branch_id: "" };

const Attendance = () => {
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [records, setRecords] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

   const fetchRecords = async () => {
     const response = await apiService.getAttendance(branchFilter ? { branch_id: branchFilter } : undefined);
     if (response.data) setRecords(response.data.results || response.data);
     setLoading(false);
   };

  useEffect(() => { fetchRecords(); }, [selectedBranch, userBranch]);

   const handleSave = async () => {
     if (!form.service || !form.date || !form.count) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
     const payload = { service: form.service, date: form.date, count: parseInt(form.count), notes: form.notes, branch_id: form.branch_id || userBranch || null };

     if (editId) {
       const response = await apiService.updateAttendance(editId, payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Record updated" });
     } else {
       const response = await apiService.createAttendance(payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Attendance recorded" });
     }
     setForm(emptyForm); setEditId(null); setDialogOpen(false); fetchRecords();
   };

  const handleEdit = (r: any) => {
    setForm({ service: r.service, date: r.date, count: String(r.count), notes: r.notes || "", branch_id: r.branch_id || "" });
    setEditId(r.id); setDialogOpen(true);
  };

   const handleDelete = async (id: string) => {
     const response = await apiService.deleteAttendance(id);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Record deleted" }); fetchRecords();
   };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Attendance Records</h2>
          <p className="text-muted-foreground text-sm">Track attendance for each service</p>
        </div>
        <div className="flex gap-2 items-center">
          {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditId(null); setForm(emptyForm); } }}>
            <DialogTrigger asChild><Button onClick={() => { setForm(emptyForm); setEditId(null); setDialogOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Record</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Edit Attendance" : "Record Attendance"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Service *</Label>
                  <Select value={form.service} onValueChange={v => setForm({...form, service: v})}>
                    <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                    <SelectContent>{services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Date *</Label><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
                <div><Label>Head Count *</Label><Input type="number" value={form.count} onChange={e => setForm({...form, count: e.target.value})} /></div>
                <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
                {isSuperAdmin && (
                  <div><Label>Branch</Label>
                    <Select value={form.branch_id} onValueChange={v => setForm({...form, branch_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                      <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">{editId ? "Update" : "Save"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-primary" />Attendance History</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : records.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No attendance records yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Service</TableHead><TableHead>Count</TableHead><TableHead>Notes</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {records.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell><Badge variant="secondary">{r.service}</Badge></TableCell>
                    <TableCell className="font-bold">{r.count}</TableCell>
                    <TableCell className="text-muted-foreground">{r.notes || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(r)}><Pencil className="h-4 w-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
