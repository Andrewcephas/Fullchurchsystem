import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import { useBranches } from "@/hooks/use-branches";
import BranchSelector from "@/components/admin/BranchSelector";
import { SmartButton } from "@/components/PermissionControl";

const departments = ["Choir", "Praise & Worship", "Dance", "Youth", "Women", "Men", "Hospitality", "Crusades"];
const memberCategories = ["Adult", "Youth", "Sunday School"];
const emptyForm = { name: "", phone: "", email: "", gender: "", department: "", date_of_birth: "", branch_id: "", address: "", member_category: "Adult" };

const Members = () => {
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

   const fetchMembers = async () => {
     const response = await apiService.getMembers(branchFilter ? { branch_id: branchFilter } : undefined);
     if (response.data) setMembers(response.data.results || response.data);
     setLoading(false);
   };

   useEffect(() => { fetchMembers(); }, [selectedBranch, userBranch]);

   const handleSave = async () => {
     if (!form.name || !form.phone) { toast({ title: "Name and phone are required", variant: "destructive" }); return; }
     const payload: any = {
       name: form.name, phone: form.phone, email: form.email, gender: form.gender,
       department: form.department, date_of_birth: form.date_of_birth || null,
       branch_id: form.branch_id || userBranch || null, address: form.address,
       member_category: form.member_category
     };

     if (editId) {
       const response = await apiService.updateMember(editId, payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Member updated" });
     } else {
       const response = await apiService.createMember(payload);
       if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
       toast({ title: "Member added" });
     }
     setForm(emptyForm); setEditId(null); setDialogOpen(false); fetchMembers();
   };

   const handleEdit = (m: any) => {
     setForm({
       name: m.name, phone: m.phone, email: m.email || "", gender: m.gender || "",
       department: m.department || "", date_of_birth: m.date_of_birth || "",
       branch_id: m.branch_id || "", address: m.address || "",
       member_category: m.member_category || "Adult"
     });
     setEditId(m.id); setDialogOpen(true);
   };

   const handleDelete = async (id: string) => {
     const response = await apiService.deleteMember(id);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Member removed" }); fetchMembers();
   };

  const handleExport = () => {
    const csv = "Name,Phone,Email,Gender,Category,Department,DOB,Address,Join Date\n" +
      members.map(m => `${m.name},${m.phone},${m.email || ""},${m.gender || ""},${m.member_category || ""},${m.department || ""},${m.date_of_birth || ""},${(m.address || "").replace(/,/g, ";")},${m.join_date || ""}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "members.csv"; a.click();
  };

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || (m.department || "").toLowerCase().includes(search.toLowerCase());
    const matchGender = filterGender === "all" || m.gender === filterGender;
    const matchCategory = filterCategory === "all" || m.member_category === filterCategory;
    return matchSearch && matchGender && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {memberCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={!members.length}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditId(null); setForm(emptyForm); } }}>
            <DialogTrigger asChild>
              <SmartButton 
                permission="add_members"
                onClick={() => { setForm(emptyForm); setEditId(null); setDialogOpen(true); }} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />Add Member
              </SmartButton>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editId ? "Edit Member" : "Add New Member"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Full Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div><Label>Phone *</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <div><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} /></div>
                <div><Label>Address</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Physical address" /></div>
                <div><Label>Gender</Label>
                  <Select value={form.gender} onValueChange={v => setForm({...form, gender: v})}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Member Category</Label>
                  <Select value={form.member_category} onValueChange={v => setForm({...form, member_category: v})}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{memberCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Department</Label>
                  <Select value={form.department} onValueChange={v => setForm({...form, department: v})}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {isSuperAdmin && (
                  <div><Label>Branch</Label>
                    <Select value={form.branch_id} onValueChange={v => setForm({...form, branch_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                      <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">{editId ? "Update Member" : "Add Member"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Members ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No members yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(m => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {m.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <p className="font-medium">{m.name}</p>
                            {m.date_of_birth && <p className="text-xs text-muted-foreground">DOB: {m.date_of_birth}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{m.phone}</p>
                          {m.email && <p className="text-xs text-muted-foreground">{m.email}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {m.gender ? (
                          <Badge variant={m.gender === 'Male' ? 'default' : 'secondary'} className={m.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}>
                            {m.gender}
                          </Badge>
                        ) : '—'}
                      </TableCell>
                      <TableCell><Badge variant="outline">{m.member_category || "Adult"}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{m.department || "Unassigned"}</Badge></TableCell>
                      <TableCell className="text-sm">{m.branch_id ? branches.find(b => b.id === m.branch_id)?.branch_name || '—' : '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{m.join_date || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <SmartButton 
                            permission="edit_members" 
                            variant="ghost" size="icon" 
                            onClick={() => handleEdit(m)}
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </SmartButton>
                          <SmartButton 
                            permission="delete_members" 
                            variant="ghost" size="icon" 
                            onClick={() => handleDelete(m.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </SmartButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
