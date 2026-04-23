import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Building2, Trash2, Pencil, Mail, Lock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

const emptyForm = { branch_name: "", location: "", pastor_name: "", pastor_email: "", pastor_password: "", create_account: true };

const Branches = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const { toast } = useToast();

   const fetchBranches = async () => {
     const response = await apiService.getBranches();
     if (response.data) setBranches(response.data.results || response.data);
     setLoading(false);
   };

   useEffect(() => { fetchBranches(); }, []);

const handleSave = async () => {
      if (!form.branch_name) { toast({ title: "Branch name is required", variant: "destructive" }); return; }
      
      if (editId) {
        const response = await apiService.updateBranch(editId, form);
        if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
        toast({ title: "Branch updated" });
      } else {
        const branchRes = await apiService.createBranch({ branch_name: form.branch_name, location: form.location, pastor_name: form.pastor_name });
        if (branchRes.error) { toast({ title: "Error", description: branchRes.error, variant: "destructive" }); return; }
        
        const branchId = branchRes.data?.id;
        
        if (form.create_account && form.pastor_email && form.pastor_password) {
          const userRes = await apiService.register({
            email: form.pastor_email,
            password: form.pastor_password,
            name: form.pastor_name,
            role: "branch_admin",
            branch_id: branchId
          });
          if (userRes.error) { 
            toast({ title: "Branch created but account failed", description: userRes.error, variant: "destructive" }); 
          } else {
            toast({ title: "Branch + Pastor Account Created", description: `Login: ${form.pastor_email}` });
          }
        } else {
          toast({ title: "Branch created" });
        }
      }
      setForm(emptyForm); setEditId(null); setDialogOpen(false); fetchBranches();
    };

const handleEdit = (b: any) => {
      setForm({ branch_name: b.branch_name, location: b.location || "", pastor_name: b.pastor_name || "", pastor_email: "", pastor_password: "", create_account: false });
      setEditId(b.id); setDialogOpen(true);
    };

   const handleDelete = async (id: string) => {
     const response = await apiService.deleteBranch(id);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Branch deleted" }); fetchBranches();
   };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Branch Management</h2>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm(emptyForm); setEditId(null); setDialogOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit Branch" : "Add Branch with Pastor Account"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Branch Name *</Label><Input value={form.branch_name} onChange={e => setForm({ ...form, branch_name: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              <div><Label>Pastor Name</Label><Input value={form.pastor_name} onChange={e => setForm({ ...form, pastor_name: e.target.value })} /></div>
              
              {!editId && (
                <div className="border-t pt-4 mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={form.create_account} 
                      onChange={e => setForm({ ...form, create_account: e.target.checked })} 
                      className="h-4 w-4"
                    />
                    <Label className="font-medium">Create Pastor Login Account</Label>
                  </div>
                  
                  {form.create_account && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                      <div><Label>Pastor Email *</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input type="email" value={form.pastor_email} onChange={e => setForm({ ...form, pastor_email: e.target.value })} placeholder="pastor@church.com" />
                        </div>
                      </div>
                      <div><Label>Password *</Label>
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <Input type="password" value={form.pastor_password} onChange={e => setForm({ ...form, pastor_password: e.target.value })} placeholder="Min 8 characters" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <UserPlus className="h-4 w-4 mr-2" />
                {editId ? "Update Branch" : "Create Branch & Account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" />Branches</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : branches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No branches yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Location</TableHead><TableHead>Pastor</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {branches.map(b => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.branch_name}</TableCell>
                    <TableCell>{b.location || "—"}</TableCell>
                    <TableCell>{b.pastor_name || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(b)}><Pencil className="h-4 w-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default Branches;
