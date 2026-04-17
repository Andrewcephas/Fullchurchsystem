import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "super_admin" | "branch_admin" | "secretary" | "member" | "sunday_school_teacher";

export interface UserRole {
  role: AppRole | null;
  branchId: string | null;
  loading: boolean;
  isSuperAdmin: boolean;
  isBranchAdmin: boolean;
  isSecretary: boolean;
  isMember: boolean;
  isSundaySchoolTeacher: boolean;
}

export const useUserRole = (): UserRole => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // For now, assume admin users are super_admin
      // In a full implementation, you'd have a UserRole model in Django
      if (user.is_superuser) {
        setRole("super_admin");
      } else {
        setRole("member"); // Default role
      }
      setBranchId(null); // TODO: Add branch support
    } else {
      setRole(null);
      setBranchId(null);
    }

    setLoading(false);
  }, [user, authLoading]);

  return {
    role,
    branchId,
    loading: loading || authLoading,
    isSuperAdmin: role === "super_admin",
    isBranchAdmin: role === "branch_admin",
    isSecretary: role === "secretary",
    isMember: role === "member",
    isSundaySchoolTeacher: role === "sunday_school_teacher",
  };
};
