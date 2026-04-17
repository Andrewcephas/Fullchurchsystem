import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useBranches } from "@/hooks/use-branches";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin (Bishop)",
  branch_admin: "Branch Pastor",
  secretary: "Secretary",
  member: "Member",
};

const UserRoles = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loginActivity, setLoginActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [form, setForm] = useState({ user_id: "", role: "", branch_id: "" });
  const branches = useBranches();
  const { toast } = useToast();

   const fetchRoles = async () => {
     const response = await apiService.getUserRoles();
     if (response.data) setRoles(response.data.results || response.data);
     setLoading(false);
   };

   const fetchLoginActivity = async () => {
     const response = await apiService.getLoginActivity({ limit: 50 });
     if (response.data) setLoginActivity(response.data.results || response.data);
   };

  useEffect(() => { fetchRoles(); fetchLoginActivity(); }, []);

   const handleAssign = async () => {
     if (!form.user_id || !form.role) { toast({ title: "User ID and role required", variant: "destructive" }); return; }
     const payload: any = { user_id: form.user_id, role: form.role };
     if (form.role !== "super_admin" && form.branch_id) payload.branch_id = form.branch_id;
     const response = await apiService.createUserRole(payload);
     if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
     toast({ title: "Role assigned" }); setDialogOpen(false); setForm({ user_id: "", role: "", branch_id: "" }); fetchRoles();
   };

   const handleDelete = async (id: string) => {
     await apiService.deleteUserRole(id);
     toast({ title: "Role removed" }); fetchRoles();
   };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">User Roles</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { fetchLoginActivity(); setActivityOpen(true); }}>
            <Eye className="h-4 w-4 mr-2" />Login Activity
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Assign Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Assign Role</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>User ID (UUID)</Label><Input value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })} placeholder="Paste user UUID" /></div>
                <div><Label>Role</Label>
                  <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin (Bishop)</SelectItem>
                      <SelectItem value="branch_admin">Branch Pastor</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.role && form.role !== "super_admin" && (
                  <div><Label>Branch</Label>
                    <Select value={form.branch_id} onValueChange={v => setForm({ ...form, branch_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                      <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={handleAssign} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Assign</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Assigned Roles</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : roles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No roles assigned yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>User ID</TableHead><TableHead>Role</TableHead><TableHead>Branch</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {roles.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.user_id}</TableCell>
                    <TableCell><Badge variant={r.role === "super_admin" ? "default" : "secondary"}>{roleLabels[r.role] || r.role}</Badge></TableCell>
                    <TableCell>{r.branches?.branch_name || "All"}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Login Activity Dialog */}
      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Recent Login Activity</DialogTitle></DialogHeader>
          {loginActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No login activity recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {loginActivity.map(a => (
                <div key={a.id} className="p-2 bg-muted rounded text-sm flex justify-between">
                  <span className="text-foreground">{a.user_email || a.user_id.slice(0, 8) + "..."}</span>
                  <span className="text-muted-foreground">{new Date(a.login_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRoles;
