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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Phone, Mail, Users, Briefcase } from "lucide-react";

interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  member_category: string;
  department: string;
  date_of_birth: string;
  address: string;
  spouse_name: string | null;
  spouse_phone: string | null;
  children_count: number | null;
  blood_type: string | null;
  occupation: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  ministry_interests: string[] | null;
  membership_status: string;
  join_date: string;
  notes: string | null;
  branch_id: string;
}

const MemberProfiles = () => {
  const { branchId, isSuperAdmin } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

   // Fetch members
   const { data: members = [], isLoading } = useQuery({
     queryKey: ["members", branchId],
     queryFn: async () => {
       const params: any = {};
       if (!isSuperAdmin && branchId) {
         params.branch_id = branchId;
       }
       const response = await apiService.getMembers(params);
       return (response.data?.results || response.data || []) as MemberProfile[];
     },
   });

   // Update member mutation
   const updateMemberMutation = useMutation({
     mutationFn: async (member: Partial<MemberProfile>) => {
       if (!member.id) throw new Error("Member ID required");
       const { error } = await apiService.updateMember(member.id, member);
       if (error) throw new Error(error);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["members", branchId] });
       setIsDialogOpen(false);
       setSelectedMember(null);
       toast({
         title: "Success",
         description: "Member profile updated successfully",
       });
     },
     onError: (error) => {
       toast({
         title: "Error",
         description: "Failed to update member profile",
         variant: "destructive",
       });
     },
   });

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Member Profiles</h2>
        <p className="text-muted-foreground">
          Manage comprehensive member information and profiles
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Members Grid */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading members...</p>
            </CardContent>
          </Card>
        ) : filteredMembers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No members found</p>
            </CardContent>
          </Card>
        ) : (
          filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription>{member.department}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{member.member_category}</Badge>
                    <Badge 
                      variant={member.membership_status === 'active' ? 'default' : 'secondary'}
                    >
                      {member.membership_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{member.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone || "N/A"}</span>
                  </div>
                </div>

                {/* Family Information */}
                {(member.spouse_name || member.children_count) && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold mb-2 text-sm">Family</h4>
                    <div className="space-y-1 text-sm">
                      {member.spouse_name && (
                        <p>Spouse: {member.spouse_name}</p>
                      )}
                      {member.children_count !== null && (
                        <p>Children: {member.children_count}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Professional Information */}
                {(member.occupation || member.blood_type) && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Professional
                    </h4>
                    <div className="space-y-1 text-sm">
                      {member.occupation && (
                        <p>Occupation: {member.occupation}</p>
                      )}
                      {member.blood_type && (
                        <p>Blood Type: {member.blood_type}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {member.emergency_contact_name && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold mb-2 text-sm">Emergency Contact</h4>
                    <div className="space-y-1 text-sm">
                      <p>Name: {member.emergency_contact_name}</p>
                      {member.emergency_contact_phone && (
                        <p>Phone: {member.emergency_contact_phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Ministry Interests */}
                {member.ministry_interests && member.ministry_interests.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Ministry Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.ministry_interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {member.notes && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold mb-2 text-sm">Notes</h4>
                    <p className="text-sm text-muted-foreground">{member.notes}</p>
                  </div>
                )}

                {/* Action Button */}
                <div className="border-t pt-3">
                  <Dialog open={isDialogOpen && selectedMember?.id === member.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setSelectedMember(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    {selectedMember?.id === member.id && (
                      <MemberEditDialog 
                        member={selectedMember}
                        onSave={(updated) => {
                          updateMemberMutation.mutate(updated);
                        }}
                        isLoading={updateMemberMutation.isPending}
                      />
                    )}
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

interface MemberEditDialogProps {
  member: MemberProfile;
  onSave: (updated: Partial<MemberProfile>) => void;
  isLoading: boolean;
}

const MemberEditDialog = ({ member, onSave, isLoading }: MemberEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<MemberProfile>>(member);

  const handleSubmit = () => {
    onSave({
      id: member.id,
      ...formData,
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Member Profile</DialogTitle>
        <DialogDescription>
          Update detailed information for {member.name}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Basic Information */}
        <div>
          <h3 className="font-semibold mb-3">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Occupation</Label>
              <Input
                value={formData.occupation || ""}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Blood Type</Label>
              <Input
                value={formData.blood_type || ""}
                onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Family Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Spouse Name</Label>
              <Input
                value={formData.spouse_name || ""}
                onChange={(e) => setFormData({ ...formData, spouse_name: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Spouse Phone</Label>
              <Input
                value={formData.spouse_phone || ""}
                onChange={(e) => setFormData({ ...formData, spouse_phone: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Number of Children</Label>
              <Input
                type="number"
                value={formData.children_count || ""}
                onChange={(e) => setFormData({ ...formData, children_count: parseInt(e.target.value) || null })}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Name</Label>
              <Input
                value={formData.emergency_contact_name || ""}
                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input
                value={formData.emergency_contact_phone || ""}
                onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Additional Notes</h3>
          <Textarea
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes about this member..."
            className="min-h-24"
          />
        </div>

        {/* Actions */}
        <div className="border-t pt-4 flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default MemberProfiles;
