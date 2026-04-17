import { useEffect, useState } from "react";
import apiService from "@/services/api";

export const useBranches = () => {
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    const loadBranches = async () => {
      const response = await apiService.getBranches();
      if (response.data) {
        setBranches(response.data.results || response.data);
      }
    };

    loadBranches();
  }, []);

  return branches;
};
