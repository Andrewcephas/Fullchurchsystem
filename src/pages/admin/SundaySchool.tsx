import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, GraduationCap, Trash2, Pencil, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import { useBranches } from "@/hooks/use-branches";
import BranchSelector from "@/components/admin/BranchSelector";

const SundaySchool = () => {
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [classes, setClasses] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [classMembers, setClassMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [form, setForm] = useState({ class_name: "", age_group: "", teacher_name: "", branch_id: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [attForm, setAttForm] = useState({ date: "", present_count: "", notes: "" });
  const [attRecords, setAttRecords] = useState<any[]>([]);
  const { toast } = useToast();

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

   const fetchClasses = async () => {
     const response = await apiService.getSundaySchoolClasses(branchFilter ? { branch_id: branchFilter } : undefined);
     if (response.data) setClasses(response.data.results || response.data);
     setLoading(false);
   };

   const fetchMembers = async () => {
     const response = await apiService.getMembers(branchFilter ? { branch_id: branchFilter } : undefined);
     if (response.data) setMembers((response.data.results || response.data).map((m: any) => ({ id: m.id, name: m.name })));
   };

  useEffect(() => { fetchClasses(); fetchMembers(); }, [selectedBranch, userBranch]);

   const handleSave = async () => {
     if (!form.class_name) { toast({ title: "Class name required", variant: "destructive" }); return; }
     const payload = { ...form, branch_id: form.branch_id || userBranch || null };
     if (editId) {
       const response = await apiService.updateSundaySchoolClass(editId, payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Class updated" });
     } else {
       const response = await apiService.createSundaySchoolClass(payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Class created" });
     }
     setForm({ class_name: "", age_group: "", teacher_name: "", branch_id: "" }); setEditId(null); setDialogOpen(false); fetchClasses();
   };

   const handleDelete = async (id: string) => {
     const response = await apiService.deleteSundaySchoolClass(id);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Class deleted" }); fetchClasses();
   };

   const openAssign = async (classId: string) => {
     setSelectedClass(classId);
     const response = await apiService.getSundaySchoolMembers({ class_id: classId });
     if (response.data) setClassMembers(response.data.results || response.data);
     setAssignOpen(true);
   };

   const assignMember = async (memberId: string) => {
     if (!selectedClass) return;
     const response = await apiService.assignMemberToClass({ class_id: selectedClass, member_id: memberId });
     if (response.error) { toast({ title: "Already assigned or error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Member assigned" });
     openAssign(selectedClass);
   };

   const removeMember = async (id: string) => {
     const response = await apiService.removeMemberFromClass(id);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Member removed" });
     if (selectedClass) openAssign(selectedClass);
   };

   const openAttendance = async (classId: string) => {
     setSelectedClass(classId);
     const response = await apiService.getSundaySchoolAttendance({ class_id: classId });
     if (response.data) setAttRecords((response.data.results || response.data).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
     setAttendanceOpen(true);
   };

   const saveAttendance = async () => {
     if (!selectedClass || !attForm.date || !attForm.present_count) return;
     const payload = {
       class_id: selectedClass,
       date: attForm.date,
       present_count: parseInt(attForm.present_count),
       notes: attForm.notes
     };
     const response = await apiService.createSundaySchoolAttendance(payload);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Attendance recorded" });
     setAttForm({ date: "", present_count: "", notes: "" });
     openAttendance(selectedClass);
   };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Sunday School</h2>
        <div className="flex gap-2 items-center">
          {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Class</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Edit Class" : "Add Class"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Class Name *</Label><Input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} /></div>
                <div><Label>Age Group</Label><Input value={form.age_group} onChange={e => setForm({ ...form, age_group: e.target.value })} placeholder="e.g. 5-8 years" /></div>
                <div><Label>Teacher Name</Label><Input value={form.teacher_name} onChange={e => setForm({ ...form, teacher_name: e.target.value })} /></div>
                {isSuperAdmin && (
                  <div><Label>Branch</Label>
                    <Select value={form.branch_id} onValueChange={v => setForm({ ...form, branch_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                      <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">{editId ? "Update" : "Create"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" />Classes</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : classes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No classes yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Class</TableHead><TableHead>Age Group</TableHead><TableHead>Teacher</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {classes.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.class_name}</TableCell>
                    <TableCell>{c.age_group || "—"}</TableCell>
                    <TableCell>{c.teacher_name || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openAssign(c.id)}><Users className="h-4 w-4 mr-1" />Members</Button>
                        <Button variant="ghost" size="sm" onClick={() => openAttendance(c.id)}>Attendance</Button>
                        <Button variant="ghost" size="icon" onClick={() => { setForm({ class_name: c.class_name, age_group: c.age_group || "", teacher_name: c.teacher_name || "", branch_id: c.branch_id || "" }); setEditId(c.id); setDialogOpen(true); }}><Pencil className="h-4 w-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assign Members Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Class Members</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Add Member</Label>
              <Select onValueChange={assignMember}>
                <SelectTrigger><SelectValue placeholder="Select member to add" /></SelectTrigger>
                <SelectContent>{members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              {classMembers.map(cm => (
                <div key={cm.id} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">{cm.members?.name || "Unknown"}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeMember(cm.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              ))}
              {classMembers.length === 0 && <p className="text-sm text-muted-foreground">No members assigned yet.</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Class Attendance</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Date</Label><Input type="date" value={attForm.date} onChange={e => setAttForm({ ...attForm, date: e.target.value })} /></div>
              <div><Label>Present</Label><Input type="number" value={attForm.present_count} onChange={e => setAttForm({ ...attForm, present_count: e.target.value })} /></div>
              <div className="flex items-end"><Button onClick={saveAttendance} className="bg-primary hover:bg-primary/90 text-primary-foreground">Record</Button></div>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {attRecords.map(a => (
                <div key={a.id} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                  <span>{a.date}</span>
                  <Badge variant="secondary">{a.present_count} present</Badge>
                  <span className="text-muted-foreground">{a.notes || ""}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SundaySchool;
