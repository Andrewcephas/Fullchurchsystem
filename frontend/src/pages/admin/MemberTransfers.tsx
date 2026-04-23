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
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Check, X, Clock } from "lucide-react";

interface Branch {
  id: string;
  branch_name: string;
  location: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch_id: string;
}

interface MemberTransfer {
  id: string;
  member_id: string;
  from_branch_id: string;
  to_branch_id: string;
  transfer_date: string;
  reason: string | null;
  status: "pending" | "approved" | "completed" | "rejected";
  approved_by: string | null;
  approval_date: string | null;
  notes: string | null;
  member?: Member;
  from_branch?: Branch;
  to_branch?: Branch;
}

const MemberTransfers = () => {
  const { branchId, isSuperAdmin, isBranchAdmin } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNewTransferDialogOpen, setIsNewTransferDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<MemberTransfer | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

   // Fetch branches
   const { data: branches = [] } = useQuery({
     queryKey: ["branches"],
     queryFn: async () => {
       const response = await apiService.getBranches();
       return response.data?.results || response.data || [];
     },
   });

   // Fetch members
   const { data: members = [] } = useQuery({
     queryKey: ["members", branchId],
     queryFn: async () => {
       const filters: any = {};
       if (!isSuperAdmin && branchId) {
         filters.branch_id = branchId;
       }
       const response = await apiService.getMembers(filters);
       return (response.data?.results || response.data || []).map((m: any) => ({
         id: m.id,
         name: m.name,
         email: m.email,
         phone: m.phone,
         branch_id: m.branch_id,
       }));
     },
   });

   // Fetch transfers
   const { data: transfers = [], isLoading } = useQuery({
     queryKey: ["member_transfers", branchId],
     queryFn: async () => {
       const filters: any = {};
       if (!isSuperAdmin && branchId) {
         // For non-superadmin, show transfers involving their branch
         filters.from_branch_id = branchId;
       }
       const response = await apiService.getMemberTransfers(
         Object.keys(filters).length > 0 ? filters : undefined
       );
       return (response.data?.results || response.data || []) as MemberTransfer[];
     },
   });

   // Create transfer mutation
   const createTransferMutation = useMutation({
     mutationFn: async (transferData: Partial<MemberTransfer>) => {
       const response = await apiService.createMemberTransfer({
         member_id: transferData.member_id,
         from_branch_id: transferData.from_branch_id,
         to_branch_id: transferData.to_branch_id,
         reason: transferData.reason,
         notes: transferData.notes,
         status: "pending",
       });

       if (response.error) throw new Error(response.error);

       // Update member's branch to the new branch (handled by API in a real scenario)
       // For now, the approval process will handle this
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["member_transfers", branchId] });
       queryClient.invalidateQueries({ queryKey: ["members", branchId] });
       setIsNewTransferDialogOpen(false);
       toast({
         title: "Success",
         description: "Transfer request created successfully",
       });
     },
     onError: (error) => {
       toast({
         title: "Error",
         description: "Failed to create transfer request",
         variant: "destructive",
       });
     },
   });

   // Approve transfer mutation
   const approveTransferMutation = useMutation({
     mutationFn: async (transferId: string) => {
       const response = await apiService.approveMemberTransfer(transferId);
       if (response.error) throw new Error(response.error);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["member_transfers", branchId] });
       setIsActionDialogOpen(false);
       toast({
         title: "Success",
         description: "Transfer approved successfully",
       });
     },
   });

   // Reject transfer mutation
   const rejectTransferMutation = useMutation({
     mutationFn: async (transferId: string) => {
       const response = await apiService.rejectMemberTransfer(transferId);
       if (response.error) throw new Error(response.error);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["member_transfers", branchId] });
       queryClient.invalidateQueries({ queryKey: ["members", branchId] });
       setIsActionDialogOpen(false);
       toast({
         title: "Success",
         description: "Transfer rejected and member reverted",
       });
     },
   });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case "approved":
        return <Badge className="flex items-center gap-1"><Check className="h-3 w-3" />Approved</Badge>;
      case "completed":
        return <Badge variant="default" className="flex items-center gap-1"><Check className="h-3 w-3" />Completed</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1"><X className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Member Transfers</h2>
          <p className="text-muted-foreground">
            Manage member transfers between branches
          </p>
        </div>
        <Dialog open={isNewTransferDialogOpen} onOpenChange={setIsNewTransferDialogOpen}>
          <DialogTrigger asChild>
            <Button>Request Transfer</Button>
          </DialogTrigger>
          <NewTransferDialog
            members={members}
            branches={branches}
            onSubmit={(data) => {
              createTransferMutation.mutate(data);
            }}
            isLoading={createTransferMutation.isPending}
          />
        </Dialog>
      </div>

      {/* Transfers Table */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading transfers...</p>
          </CardContent>
        </Card>
      ) : transfers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No member transfers yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>From Branch</TableHead>
                <TableHead>To Branch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.member?.name || "Unknown"}</TableCell>
                  <TableCell>{transfer.from_branch?.branch_name || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      {transfer.to_branch?.branch_name || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(transfer.transfer_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                  <TableCell>
                    <Dialog open={isActionDialogOpen && selectedTransfer?.id === transfer.id} onOpenChange={(open) => {
                      setIsActionDialogOpen(open);
                      if (!open) setSelectedTransfer(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={transfer.status !== "pending"}
                          onClick={() => setSelectedTransfer(transfer)}
                        >
                          {transfer.status === "pending" ? "Review" : "Viewed"}
                        </Button>
                      </DialogTrigger>
                      {selectedTransfer?.id === transfer.id && (
                        <TransferActionDialog
                          transfer={selectedTransfer}
                          onApprove={() => approveTransferMutation.mutate(transfer.id)}
                          onReject={() => rejectTransferMutation.mutate(transfer.id)}
                          isLoading={approveTransferMutation.isPending || rejectTransferMutation.isPending}
                        />
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

interface NewTransferDialogProps {
  members: Member[];
  branches: Branch[];
  onSubmit: (data: Partial<MemberTransfer>) => void;
  isLoading: boolean;
}

const NewTransferDialog = ({
  members,
  branches,
  onSubmit,
  isLoading,
}: NewTransferDialogProps) => {
  const [formData, setFormData] = useState({
    member_id: "",
    to_branch_id: "",
    reason: "",
    notes: "",
  });

  const selectedMember = members.find((m) => m.id === formData.member_id);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Request Member Transfer</DialogTitle>
        <DialogDescription>
          Transfer a member to a different branch
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label>Member</Label>
          <Select value={formData.member_id} onValueChange={(value) => setFormData({ ...formData, member_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMember && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="text-muted-foreground">Current Branch:</p>
            <p className="font-semibold">
              {branches.find((b) => b.id === selectedMember.branch_id)?.branch_name || "Unknown"}
            </p>
          </div>
        )}

        <div>
          <Label>Transfer To</Label>
          <Select value={formData.to_branch_id} onValueChange={(value) => setFormData({ ...formData, to_branch_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination branch" />
            </SelectTrigger>
            <SelectContent>
              {branches
                .filter((b) => b.id !== selectedMember?.branch_id)
                .map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.branch_name} ({branch.location})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Reason for Transfer</Label>
          <Input
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="e.g., Relocation, Work reasons..."
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes..."
            className="min-h-20"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={() => onSubmit(formData)}
            disabled={!formData.member_id || !formData.to_branch_id || isLoading}
          >
            {isLoading ? "Requesting..." : "Request Transfer"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

interface TransferActionDialogProps {
  transfer: MemberTransfer;
  onApprove: () => void;
  onReject: () => void;
  isLoading: boolean;
}

const TransferActionDialog = ({
  transfer,
  onApprove,
  onReject,
  isLoading,
}: TransferActionDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Review Transfer Request</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Member</p>
            <p className="font-semibold">{transfer.member?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-semibold">
              {new Date(transfer.transfer_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Transfer Route</p>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="font-semibold">{transfer.from_branch?.branch_name}</span>
            <ArrowRight className="h-4 w-4" />
            <span className="font-semibold">{transfer.to_branch?.branch_name}</span>
          </div>
        </div>

        {transfer.reason && (
          <div>
            <p className="text-sm text-muted-foreground">Reason</p>
            <p>{transfer.reason}</p>
          </div>
        )}

        {transfer.notes && (
          <div>
            <p className="text-sm text-muted-foreground">Notes</p>
            <p>{transfer.notes}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={isLoading}
          >
            Reject
          </Button>
          <Button onClick={onApprove} disabled={isLoading}>
            {isLoading ? "Processing..." : "Approve"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default MemberTransfers;
