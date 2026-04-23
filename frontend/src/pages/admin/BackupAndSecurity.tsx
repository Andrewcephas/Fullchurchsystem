import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  HardDrive,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lock,
  Eye,
  Shield,
  Database,
} from "lucide-react";

interface BackupLog {
  id: string;
  backup_type: "full" | "incremental" | "member_data" | "finance_data";
  status: "pending" | "in_progress" | "completed" | "failed";
  started_at: string;
  completed_at: string | null;
  backup_size_bytes: number | null;
  records_backed_up: number | null;
  error_message: string | null;
  storage_location: string | null;
  retention_days: number;
  initiated_by: string | null;
}

interface DataAccessLog {
  id: string;
  user_id: string;
  table_name: string;
  operation: "select" | "insert" | "update" | "delete" | "export";
  record_count: number | null;
  filters_applied: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const BackupAndSecurity = () => {
  const { isSuperAdmin } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [backupType, setBackupType] = useState<"full" | "incremental" | "member_data">("full");

  // Fetch backup logs (must be called unconditionally)
  const { data: backupLogs = [], isLoading: isLoadingBackups } = useQuery({
    queryKey: ["backup-logs"],
    queryFn: async () => {
      const response = await apiService.getBackupLogs({ limit: 20 });
      return (response.data?.results || response.data || []) as BackupLog[];
    },
  });

  // Fetch data access logs (must be called unconditionally)
  const { data: accessLogs = [], isLoading: isLoadingAccessLogs } = useQuery({
    queryKey: ["data-access-logs"],
    queryFn: async () => {
      const response = await apiService.getDataAccessLogs({ limit: 50 });
      return (response.data?.results || response.data || []) as DataAccessLog[];
    },
  });

  // Create backup mutation (must be called unconditionally)
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiService.createBackup(backupType);
      if (response.error) throw new Error(response.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backup-logs"] });
      setIsBackupDialogOpen(false);
      toast({
        title: "Success",
        description: "Backup process initiated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initiate backup",
        variant: "destructive",
      });
    },
  });

  // Check authorization after hooks
  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access backup and security settings. Only Super Admins can manage backups.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 animate-spin" />
            In Progress
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Backup & Security</h2>
          <p className="text-muted-foreground">
            Manage data backups and security audit logs
          </p>
        </div>
        <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <HardDrive className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Data Backup</DialogTitle>
              <DialogDescription>
                Initiate a data backup to protect your church's information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Backup Type</Label>
                <Select value={backupType} onValueChange={(value: any) => setBackupType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Backup</SelectItem>
                    <SelectItem value="incremental">Incremental Backup</SelectItem>
                    <SelectItem value="member_data">Member Data Only</SelectItem>
                    <SelectItem value="finance_data">Finance Data Only</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {backupType === "full" &&
                    "Complete backup of all data including members, finance, attendance, and settings"}
                  {backupType === "incremental" &&
                    "Only backup data changed since last backup"}
                  {backupType === "member_data" &&
                    "Backup member profiles and related information"}
                  {backupType === "finance_data" &&
                    "Backup all financial records and giving data"}
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                Backup will be automatically retained for 30 days and stored securely.
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button
                  onClick={() => createBackupMutation.mutate()}
                  disabled={createBackupMutation.isPending}
                >
                  {createBackupMutation.isPending ? "Starting..." : "Start Backup"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Alerts */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All data access is encrypted and logged. Access logs are maintained for security audits.
          Critical operations require Super Admin authorization.
        </AlertDescription>
      </Alert>

      {/* Backup Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup History
          </CardTitle>
          <CardDescription>
            Recent backup operations and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBackups ? (
            <p className="text-center text-muted-foreground py-8">Loading backups...</p>
          ) : backupLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No backups yet. Create one to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupLogs.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-semibold capitalize">
                        {backup.backup_type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(backup.started_at).toLocaleDateString()} at{" "}
                        {new Date(backup.started_at).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        {backup.backup_size_bytes
                          ? formatBytes(backup.backup_size_bytes)
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {backup.records_backed_up || "—"}
                      </TableCell>
                      <TableCell>
                        {backup.status === "completed" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Access Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Access Logs
          </CardTitle>
          <CardDescription>
            Audit trail of all sensitive data access and modifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAccessLogs ? (
            <p className="text-center text-muted-foreground py-8">Loading logs...</p>
          ) : accessLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No access logs recorded yet
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {accessLogs.slice(0, 20).map((log) => (
                <div
                  key={log.id}
                  className="p-3 border rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="font-semibold">
                        {log.operation.toUpperCase()} on {log.table_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                        {log.record_count && ` • ${log.record_count} records`}
                      </p>
                      {log.ip_address && (
                        <p className="text-xs text-muted-foreground">
                          IP: {log.ip_address}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {log.operation}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Configure security policies and data protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">Backup Retention Policy</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  All backups are automatically retained for 30 days before deletion
                </p>
              </div>
              <Badge variant="outline">30 Days</Badge>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">Data Encryption</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  All data is encrypted at rest and in transit using industry-standard protocols
                </p>
              </div>
              <Badge className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Enabled
              </Badge>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">Role-Based Access Control</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Data access is restricted based on user roles and branch assignments
                </p>
              </div>
              <Badge className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">Audit Logging</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  All sensitive operations are logged and timestamped for compliance
                </p>
              </div>
              <Badge className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Enabled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupAndSecurity;
