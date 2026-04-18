import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/api";

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
    const fetchUserRole = async () => {
      if (authLoading) return;

      if (user) {
        // Check Django User model directly for superuser status
        if (user.is_superuser) {
          setRole("super_admin");
        } else if (user.is_staff) {
          // Staff users can be branch admins or secretaries - need to check user role
          try {
            const response = await apiService.getUserRoles({ user_id: user.id });
            if (response.data && response.data.length > 0) {
              const userRole = response.data[0];
              setRole(userRole.role as AppRole);
              setBranchId(userRole.branch_id || null);
            } else {
              // Staff but no role assigned - treat as secretary
              setRole("secretary");
            }
          } catch {
            setRole("secretary");
          }
        } else {
          // Regular user - check for member role
          setRole("member");
        }
      } else {
        setRole(null);
        setBranchId(null);
      }

      setLoading(false);
    };

    fetchUserRole();
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
