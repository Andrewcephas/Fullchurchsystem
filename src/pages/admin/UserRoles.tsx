import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Trash2, RotateCcw, UserCheck, Eye, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useBranches } from "@/hooks/use-branches";
import { useUserRole } from "@/hooks/use-user-role";
import { motion, AnimatePresence } from "framer-motion";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin (Bishop)",
  branch_admin: "Branch Pastor",
  secretary: "Secretary",
  sunday_school_teacher: "Sunday School Teacher",
  member: "Member",
};

const roleColors: Record<string, string> = {
  super_admin: "bg-purple-500/10 text-purple-600 border-purple-200",
  branch_admin: "bg-blue-500/10 text-blue-600 border-blue-200",
  secretary: "bg-green-500/10 text-green-600 border-green-200",
  sunday_school_teacher: "bg-orange-500/10 text-orange-600 border-orange-200",
  member: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const UserRoles = () => {
  const { isSuperAdmin } = useUserRole();
  const [roles, setRoles] = useState<any[]>([]);
  const [loginActivity, setLoginActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Member search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [assignRole, setAssignRole] = useState("secretary");
  const [assignBranchId, setAssignBranchId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignResult, setAssignResult] = useState<any>(null);

  // Dialog state
  const [activityOpen, setActivityOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetForm, setResetForm] = useState({ userId: "", newPassword: "" });

  const branches = useBranches();
  const { toast } = useToast();

  const fetchRoles = async () => {
    const response = await apiService.getUserRoles();
    if (response.data) setRoles((response.data as any).results || response.data);
    setLoading(false);
  };

  const fetchLoginActivity = async () => {
    const response = await apiService.getLoginActivity({ limit: 50 });
    if (response.data) setLoginActivity((response.data as any).results || response.data);
  };

  useEffect(() => {
    fetchRoles();
    fetchLoginActivity();
  }, []);

  // Debounced member search
  const searchMembers = useCallback(async (query: string) => {
    if (query.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    const response = await apiService.getMembers({ search: query });
    if (response.data) {
      const data = response.data as any;
      setSearchResults(data.results || data);
    }
    setSearching(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchMembers(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, searchMembers]);

  const handleSelectMember = (member: any) => {
    setSelectedMember(member);
    setAssignBranchId(member.branch || "");
    setSearchQuery(member.name);
    setSearchResults([]);
    setAssignResult(null);
    setAssignDialogOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedMember) return;
    setAssigning(true);
    const response = await apiService.assignMemberAsAdmin(
      selectedMember.id,
      assignRole,
      assignBranchId || undefined
    );
    setAssigning(false);

    if (response.error) {
      toast({ title: "Assignment Failed", description: response.error, variant: "destructive" });
      return;
    }

    const result = (response.data as any);
    setAssignResult(result);
    toast({ title: "Role Assigned!", description: result.message });
    fetchRoles();
  };

  const handleDelete = async (id: string) => {
    await apiService.deleteUserRole(id);
    toast({ title: "Role removed" });
    fetchRoles();
  };

  const handleResetPassword = async () => {
    if (!resetForm.userId || !resetForm.newPassword) {
      toast({ title: "User and new password required", variant: "destructive" });
      return;
    }
    const response = await apiService.resetAdminPassword(resetForm.userId, resetForm.newPassword);
    if (response.error) { toast({ title: "Error", description: response.error, variant: "destructive" }); return; }
    toast({ title: "Password reset successfully" });
    setResetPasswordOpen(false);
    setResetForm({ userId: "", newPassword: "" });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied!`, description: text });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">User Roles & Access</h2>
        <Button variant="outline" onClick={() => { fetchLoginActivity(); setActivityOpen(true); }}>
          <Eye className="h-4 w-4 mr-2" />Login Activity
        </Button>
      </div>

      {/* Member Search — Assign as Pastor/Secretary */}
      {isSuperAdmin && (
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              Assign Member as Pastor or Secretary
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Search for a church member by name or email, then assign them a system role.
              Their <strong>Gmail</strong> becomes their login username and their <strong>phone number</strong> becomes their password.
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {searching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </div>
              <Input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSelectedMember(null); }}
                placeholder="Search by member name or email..."
                className="pl-10 h-12 rounded-xl border-2"
              />
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 border rounded-xl overflow-hidden shadow-lg bg-background"
                >
                  {searchResults.slice(0, 8).map(member => (
                    <button
                      key={member.id}
                      onClick={() => handleSelectMember(member)}
                      className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.email || <span className="text-destructive">No email</span>}
                          {" · "}{member.phone || <span className="text-destructive">No phone</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{member.branch_name}</p>
                        <Badge variant="outline" className="text-xs mt-1">{member.member_category}</Badge>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2 text-center py-4">
                No members found matching "{searchQuery}"
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assigned Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            System Users & Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No roles assigned yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email / Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.user_email || `User #${r.user}`}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[r.role] || roleColors.member}`}>
                        {roleLabels[r.role] || r.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.branch_name || "All Branches"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => { setResetForm({ userId: r.user, newPassword: "" }); setResetPasswordOpen(true); }}
                          title="Reset Password"
                        >
                          <RotateCcw className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleDelete(r.id)}
                          title="Remove Role"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assign Role Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={open => { setAssignDialogOpen(open); if (!open) { setAssignResult(null); setSelectedMember(null); setSearchQuery(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign System Role</DialogTitle>
          </DialogHeader>

          {assignResult ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200">
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                <p className="text-sm font-medium text-green-700 dark:text-green-400">{assignResult.message}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Login Credentials</p>
                <div className="bg-muted rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Email (Username)</p>
                      <p className="font-mono font-semibold">{assignResult.credentials?.login_email}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(assignResult.credentials?.login_email, "Email")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Password (Phone Number)</p>
                      <p className="font-mono font-semibold">{assignResult.credentials?.login_password}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(assignResult.credentials?.login_password, "Password")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="pt-1 border-t">
                    <p className="text-xs text-muted-foreground">Role: <strong>{assignResult.credentials?.role}</strong> at <strong>{assignResult.credentials?.branch}</strong></p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">Share these credentials securely. The user can log in at <strong>/login</strong> with their email and phone number.</p>
                </div>
              </div>

              <Button className="w-full" onClick={() => { setAssignDialogOpen(false); setAssignResult(null); setSelectedMember(null); setSearchQuery(""); }}>
                Done
              </Button>
            </motion.div>
          ) : selectedMember && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-xl">
                <p className="font-bold text-foreground">{selectedMember.name}</p>
                <p className="text-sm text-muted-foreground">{selectedMember.email || "⚠ No email"} · {selectedMember.phone || "⚠ No phone"}</p>
                <p className="text-xs text-muted-foreground mt-1">Branch: {selectedMember.branch_name}</p>
                {!selectedMember.email && (
                  <p className="text-xs text-destructive mt-2 font-medium">⚠ This member needs an email address before they can be assigned a role.</p>
                )}
                {!selectedMember.phone && (
                  <p className="text-xs text-destructive mt-1 font-medium">⚠ This member needs a phone number (used as password).</p>
                )}
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Role to Assign</Label>
                <Select value={assignRole} onValueChange={setAssignRole}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branch_admin">🏛 Branch Pastor</SelectItem>
                    <SelectItem value="secretary">📋 Secretary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Branch</Label>
                <Select value={assignBranchId} onValueChange={setAssignBranchId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select branch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAssignRole}
                disabled={assigning || !selectedMember.email || !selectedMember.phone}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {assigning ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Assigning...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Assign as {assignRole === "branch_admin" ? "Pastor" : "Secretary"}
                  </span>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                  <span className="text-foreground">{a.user_email || `User ${a.user}`}</span>
                  <span className="text-muted-foreground">{new Date(a.login_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset Password</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Password *</Label>
              <Input
                type="password"
                value={resetForm.newPassword}
                onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="mt-1.5"
              />
            </div>
            <Button onClick={handleResetPassword} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Reset Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRoles;
