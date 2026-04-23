/**
 * Django API Service
 * Handles all HTTP requests to Django backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  results?: T[];
  count?: number;
  next?: string;
  previous?: string;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

class ApiService {
  private baseUrl: string = API_BASE_URL;
  private headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  private getCSRFToken(): string | null {
    const name = 'csrftoken';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()!.split(';').shift() || null;
    }
    return null;
  }

  /**
   * Make HTTP request to Django API
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const method = options.method?.toUpperCase() || 'GET';
      const csrfToken = this.getCSRFToken();
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.headers,
          ...(csrfToken && ['POST','PUT','PATCH','DELETE'].includes(method) ? { 'X-CSRFToken': csrfToken } : {}),
          ...options.headers,
        },
        credentials: 'include', // Include cookies for session auth
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.error || `HTTP ${response.status}`
        );
      }

      if (response.status === 204) {
        return { data: {} as T };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(endpoint + queryString, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body: any
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body: any
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body: any
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Branches
  async getBranches() {
    return this.get('/branches/');
  }

  async getBranch(id: string) {
    return this.get(`/branches/${id}/`);
  }

  async createBranch(data: any) {
    return this.post('/branches/', data);
  }

  async updateBranch(id: string, data: any) {
    return this.put(`/branches/${id}/`, data);
  }

  async deleteBranch(id: string) {
    return this.delete(`/branches/${id}/`);
  }

  // Members
  async getMembers(filters?: Record<string, any>) {
    return this.get('/members/', filters);
  }

  async getMember(id: string) {
    return this.get(`/members/${id}/`);
  }

  async getMemberProfile(id: string) {
    return this.get(`/members/${id}/profile/`);
  }

  async getMemberActivities(id: string) {
    return this.get(`/members/${id}/activities/`);
  }

  async createMember(data: any) {
    return this.post('/members/', data);
  }

  async updateMember(id: string, data: any) {
    return this.put(`/members/${id}/`, data);
  }

  async deleteMember(id: string) {
    return this.delete(`/members/${id}/`);
  }

  async bulkImportMembers(csvData: any) {
    return this.post('/members/bulk_import/', csvData);
  }

  // User Roles
  async getUserRoles(filters?: Record<string, any>) {
    return this.get('/user-roles/', filters);
  }

  async getUserRole(id: string) {
    return this.get(`/user-roles/${id}/`);
  }

  async createUserRole(data: any) {
    return this.post('/user-roles/', data);
  }

  async updateUserRole(id: string, data: any) {
    return this.put(`/user-roles/${id}/`, data);
  }

  async deleteUserRole(id: string) {
    return this.delete(`/user-roles/${id}/`);
  }

  // Roles & Permissions
  async getRoles() {
    return this.get('/roles/');
  }

  async getRole(id: string) {
    return this.get(`/roles/${id}/`);
  }

  async createRole(data: any) {
    return this.post('/roles/', data);
  }

  async updateRole(id: string, data: any) {
    return this.put(`/roles/${id}/`, data);
  }

  async deleteRole(id: string) {
    return this.delete(`/roles/${id}/`);
  }

  async getPermissions() {
    return this.get('/permissions/');
  }

  // Login Activity
  async getLoginActivity(filters?: Record<string, any>) {
    return this.get('/login-activity/', filters);
  }

   // Sunday School Classes
   async getSundaySchoolClasses(filters?: Record<string, any>) {
     return this.get('/sunday-school/', filters);
   }

   async getSundaySchoolClass(id: string) {
     return this.get(`/sunday-school/${id}/`);
   }

   async createSundaySchoolClass(data: any) {
     return this.post('/sunday-school/', data);
   }

   async updateSundaySchoolClass(id: string, data: any) {
     return this.put(`/sunday-school/${id}/`, data);
   }

   async deleteSundaySchoolClass(id: string) {
     return this.delete(`/sunday-school/${id}/`);
   }

  // Sunday School Members (Assignments)
  async getSundaySchoolMembers(filters?: Record<string, any>) {
    return this.get('/sunday-school/members/', filters);
  }

  async assignMemberToClass(data: { class_id: string; member_id: string }) {
    return this.post('/sunday-school/members/', data);
  }

  async removeMemberFromClass(id: string) {
    return this.request(`/sunday-school/members/?enrollment_id=${id}`, { method: 'DELETE' });
  }

  // Sunday School Attendance
  async getSundaySchoolAttendance(filters?: Record<string, any>) {
    return this.get('/sunday-school/attendance/', filters);
  }

  async getSundaySchoolAttendanceRecord(id: string) {
    return this.get(`/sunday-school/attendance/${id}/`);
  }

  async createSundaySchoolAttendance(data: any) {
    return this.post('/sunday-school/attendance/', data);
  }

  // Attendance
  async getAttendance(filters?: Record<string, any>) {
    return this.get('/attendance/', filters);
  }

  async getAttendanceRecord(id: string) {
    return this.get(`/attendance/${id}/`);
  }

  async createAttendance(data: any) {
    return this.post('/attendance/', data);
  }

   async checkInMember(attendanceId: string, memberId: string) {
     return this.post(`/attendance/${attendanceId}/check_in_member/`, {
       member_id: memberId,
     });
   }

   async updateAttendance(id: string, data: any) {
     return this.put(`/attendance/${id}/`, data);
   }

   async deleteAttendance(id: string) {
     return this.delete(`/attendance/${id}/`);
   }

  // Finance
  async getFinance(filters?: Record<string, any>) {
    return this.get('/finance/', filters);
  }

  async getFinanceRecord(id: string) {
    return this.get(`/finance/${id}/`);
  }

  async createFinance(data: any) {
    return this.post('/finance/', data);
  }

  async updateFinance(id: string, data: any) {
    return this.put(`/finance/${id}/`, data);
  }

  async deleteFinance(id: string) {
    return this.delete(`/finance/${id}/`);
  }

  async getFinanceSummary(filters?: Record<string, any>) {
    return this.get('/finance/summary/', filters);
  }

  async exportFinanceReport(filters?: Record<string, any>) {
    return this.post('/finance/export_report/', filters);
  }

  // Events
  async getEvents(filters?: Record<string, any>) {
    return this.get('/events/', filters);
  }

  async getEvent(id: string) {
    return this.get(`/events/${id}/`);
  }

  async createEvent(data: any) {
    return this.post('/events/', data);
  }

  async updateEvent(id: string, data: any) {
    return this.put(`/events/${id}/`, data);
  }

  async deleteEvent(id: string) {
    return this.delete(`/events/${id}/`);
  }

  // Sermons
  async getSermons(filters?: Record<string, any>) {
    return this.get('/sermons/', filters);
  }

  async getSermon(id: string) {
    return this.get(`/sermons/${id}/`);
  }

  async createSermon(data: any) {
    return this.post('/sermons/', data);
  }

  async updateSermon(id: string, data: any) {
    return this.put(`/sermons/${id}/`, data);
  }

  async deleteSermon(id: string) {
    return this.delete(`/sermons/${id}/`);
  }

  // Notices
  async getNotices(filters?: Record<string, any>) {
    return this.get('/notices/', filters);
  }

  async getNotice(id: string) {
    return this.get(`/notices/${id}/`);
  }

  async createNotice(data: any) {
    return this.post('/notices/', data);
  }

  async updateNotice(id: string, data: any) {
    return this.put(`/notices/${id}/`, data);
  }

  async deleteNotice(id: string) {
    return this.delete(`/notices/${id}/`);
  }

  // Prayer Requests
  async getPrayerRequests(filters?: Record<string, any>) {
    return this.get('/prayer-requests/', filters);
  }

  async getPrayerRequest(id: string) {
    return this.get(`/prayer-requests/${id}/`);
  }

   async createPrayerRequest(data: any) {
     return this.post('/prayer-requests/', data);
   }

   async updatePrayerRequest(id: string, data: any) {
     return this.put(`/prayer-requests/${id}/`, data);
   }

   async deletePrayerRequest(id: string) {
     return this.delete(`/prayer-requests/${id}/`);
   }

   // Private Messages
   async getPrivateMessages(filters?: Record<string, any>) {
     return this.get('/private-messages/', filters);
   }

   async createPrivateMessage(data: any) {
     return this.post('/private-messages/', data);
   }

   async updatePrivateMessage(id: string, data: any) {
     return this.put(`/private-messages/${id}/`, data);
   }

   async deletePrivateMessage(id: string) {
     return this.delete(`/private-messages/${id}/`);
   }

   // Site Settings
   async getSiteSettings() {
     return this.get('/site-settings/');
   }

   async updateSiteSetting(key: string, value: any) {
     return this.post('/site-settings/', { key, value });
   }

   async bulkUpdateSiteSettings(settings: Record<string, any>) {
     return this.post('/site-settings/bulk_update/', settings);
   }

   // Communications
   async getCommunications(filters?: Record<string, any>) {
     return this.get('/communications/', filters);
   }

   async createCommunication(data: any) {
     return this.post('/communications/', data);
   }

   async updateCommunication(id: string, data: any) {
     return this.put(`/communications/${id}/`, data);
   }

   async deleteCommunication(id: string) {
     return this.delete(`/communications/${id}/`);
   }

  // Member Transfers
  async getMemberTransfers(filters?: Record<string, any>) {
    return this.get('/member-transfers/', filters);
  }

  async getMemberTransfer(id: string) {
    return this.get(`/member-transfers/${id}/`);
  }

  async createMemberTransfer(data: any) {
    return this.post('/member-transfers/', data);
  }

  async approveMemberTransfer(id: string) {
    return this.post(`/member-transfers/${id}/approve/`, {});
  }

  async rejectMemberTransfer(id: string) {
    return this.post(`/member-transfers/${id}/reject/`, {});
  }

  // Notification Preferences
  async getNotificationPreferences() {
    return this.get('/notification-preferences/my_preferences/');
  }

  async updateNotificationPreferences(data: any) {
    return this.post('/notification-preferences/my_preferences/', data);
  }

  // Analytics
  async getMemberGrowth(filters?: Record<string, any>) {
    return this.get('/analytics/member_growth/', filters);
  }

  async getAttendanceSummary(filters?: Record<string, any>) {
    return this.get('/analytics/attendance_summary/', filters);
  }

  async getFinancialSummary(filters?: Record<string, any>) {
    return this.get('/analytics/financial_summary/', filters);
  }

  // Backup & Security
  async getBackupLogs(filters?: Record<string, any>) {
    return this.get('/backup-logs/', filters);
  }

  async createBackup(backupType: string = 'full') {
    return this.post('/backup-logs/create_backup/', {
      backup_type: backupType,
    });
  }

  async getDataAccessLogs(filters?: Record<string, any>) {
    return this.get('/data-access-logs/', filters);
  }

  // Authentication
  async login(credentials: { username: string; password: string }) {
    return this.post('/auth/login/', credentials);
  }

  async logout() {
    return this.post('/auth/logout/', {});
  }

  async getCurrentUser() {
    return this.get('/auth/user/');
  }

   async register(userData: any) {
     return this.post('/auth/register/', userData);
   }

   // Social Quotes
   async generateSocialQuotes(theme: string) {
     return this.post('/social-quotes/generate/', { theme });
   }

    async getSocialQuotes(filters?: Record<string, any>) {
      return this.get('/social-quotes/', filters);
    }

    // Admin User Accounts
    async getAdminUsers(filters?: Record<string, any>) {
      return this.get('/admin-users/', filters);
    }

    async createAdminUser(data: any) {
      return this.post('/admin-users/', data);
    }

    async updateAdminUser(id: string, data: any) {
      return this.put(`/admin-users/${id}/`, data);
    }

    async resetAdminPassword(userId: string, newPassword: string) {
      return this.post('/admin-users/reset_password/', { user_id: userId, new_password: newPassword });
    }

    async deleteAdminUser(id: string) {
      return this.delete(`/admin-users/${id}/`);
    }

    async getAdminUsersByRole(role: string, branchId?: string) {
      return this.get('/admin-users/', { role, branch_id: branchId });
    }

    // Password Reset
    async requestPasswordReset(username: string) {
      return this.post('/admin-users/request_reset/', { username });
    }

    async getPasswordResetRequests() {
      return this.get('/password-resets/');
    }

    async approvePasswordReset(id: string, newPassword: string) {
      return this.post(`/password-resets/${id}/approve/`, { new_password: newPassword });
    }

    async rejectPasswordReset(id: string) {
      return this.post(`/password-resets/${id}/reject/`, {});
    }
  }

export default new ApiService();
export type { ApiResponse, PaginatedResponse };
