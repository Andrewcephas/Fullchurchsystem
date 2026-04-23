import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Edit, Trash2, Check, Lock, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface Permission {
  id: string;
  name: string;
  codename: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const RolesManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Partial<Role> | null>(null);
  const [saving, setSaving] = useState(false);
  
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [rolesRes, permsRes] = await Promise.all([
      apiService.getRoles(),
      apiService.getPermissions()
    ]);
    
    if (rolesRes.data) setRoles((rolesRes.data as any).results || rolesRes.data);
    if (permsRes.data) setPermissions((permsRes.data as any).results || permsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRole = () => {
    setCurrentRole({
      name: "",
      description: "",
      permissions: []
    });
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole({ ...role });
    setIsDialogOpen(true);
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this role? Users with this role will lose their permissions.")) return;
    
    const response = await apiService.deleteRole(id);
    if (response.error) {
      toast({ title: "Error", description: response.error, variant: "destructive" });
    } else {
      toast({ title: "Role deleted successfully" });
      fetchData();
    }
  };

  const handleTogglePermission = (codename: string) => {
    if (!currentRole) return;
    
    const newPermissions = currentRole.permissions?.includes(codename)
      ? currentRole.permissions.filter(p => p !== codename)
      : [...(currentRole.permissions || []), codename];
      
    setCurrentRole({ ...currentRole, permissions: newPermissions });
  };

  const handleSaveRole = async () => {
    if (!currentRole?.name) {
      toast({ title: "Name required", description: "Please enter a role name", variant: "destructive" });
      return;
    }

    setSaving(true);
    const response = currentRole.id 
      ? await apiService.updateRole(currentRole.id, currentRole)
      : await apiService.createRole(currentRole);
    
    setSaving(false);
    
    if (response.error) {
      toast({ title: "Error", description: response.error, variant: "destructive" });
    } else {
      toast({ title: `Role ${currentRole.id ? 'updated' : 'created'} successfully` });
      setIsDialogOpen(false);
      fetchData();
    }
  };

  const permsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Role & Permission Management</h2>
          <p className="text-sm text-muted-foreground">Define system roles and assign granular permissions.</p>
        </div>
        <Button onClick={handleCreateRole} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create New Role
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Available System Roles
            </CardTitle>
            <CardDescription>
              Roles assigned to pastors, secretaries, and other staff members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : roles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No custom roles defined yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-bold">{role.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {role.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.length === permissions.length ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                              Full Access
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              {role.permissions.length} Permissions
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role.id)}>
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {currentRole?.id ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              Define the role name and select permissions that apply.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Branch Pastor, Junior Secretary"
                  value={currentRole?.name || ""}
                  onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Briefly describe what this role can do"
                  value={currentRole?.description || ""}
                  onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Assign Permissions
              </Label>
              
              <div className="grid gap-6">
                {Object.entries(permsByCategory).map(([category, perms]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-sm font-semibold border-b pb-1">{category}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {perms.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={perm.codename}
                            checked={currentRole?.permissions?.includes(perm.codename)}
                            onCheckedChange={() => handleTogglePermission(perm.codename)}
                          />
                          <label
                            htmlFor={perm.codename}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {perm.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveRole} disabled={saving} className="bg-primary">
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {currentRole?.id ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesManagement;
