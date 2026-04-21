import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, ClipboardCheck, DollarSign, Calendar, Book,
  MessageSquare, Heart, BarChart3, LogOut, Menu, ChevronLeft, Settings, Sparkles,
  Building2, GraduationCap, Shield, Bell, Mail, UserPlus, ArrowRightLeft, TrendingUp,
  HardDrive, ShieldAlert
} from "lucide-react";
import { SmartLink } from "@/components/PermissionControl";
import apiService from "@/services/api";

const sidebarItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "" },
  { title: "Branches", href: "/admin/branches", icon: Building2, permission: "manage_branches" },
  { title: "Members", href: "/admin/members", icon: Users, permission: "view_members" },
  { title: "Member Profiles", href: "/admin/member-profiles", icon: UserPlus, badge: "NEW", permission: "view_members" },
  { title: "Member Transfers", href: "/admin/member-transfers", icon: ArrowRightLeft, badge: "NEW", permission: "view_members" },
  { title: "Attendance", href: "/admin/attendance", icon: ClipboardCheck, permission: "manage_attendance" },
  { title: "Finance", href: "/admin/finance", icon: DollarSign, permission: "view_finance" },
  { title: "Finance Reports", href: "/admin/finance-reports", icon: TrendingUp, badge: "NEW", permission: "view_reports" },
  { title: "Events", href: "/admin/events", icon: Calendar, permission: "manage_events" },
  { title: "Sermons", href: "/admin/sermons", icon: Book, permission: "manage_sermons" },
  { title: "Sunday School", href: "/admin/sunday-school", icon: GraduationCap, permission: "manage_sunday_school" },
  { title: "Notices", href: "/admin/notices", icon: Bell, permission: "manage_notices" },
  { title: "Messages", href: "/admin/messages", icon: Mail, permission: "" },
  { title: "Communications", href: "/admin/communications", icon: MessageSquare, permission: "manage_communications" },
  { title: "Prayer Requests", href: "/admin/prayer-requests", icon: Heart, permission: "manage_prayer_requests" },
  { title: "Social Quotes", href: "/admin/social-quotes", icon: Sparkles, permission: "manage_sermons" },
  { title: "Notifications", href: "/admin/notifications", icon: Bell, badge: "NEW", permission: "" },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3, permission: "view_reports" },
  { title: "Analytics Enhanced", href: "/admin/analytics-enhanced", icon: TrendingUp, badge: "ENHANCED", permission: "view_reports" },
  { title: "Backup & Security", href: "/admin/backup-security", icon: HardDrive, badge: "NEW", permission: "manage_roles_permissions" },
  { title: "Roles Management", href: "/admin/roles-management", icon: ShieldAlert, badge: "PRO", permission: "manage_roles_permissions" },
  { title: "User Roles", href: "/admin/user-roles", icon: Shield, permission: "manage_roles_permissions" },
  { title: "Settings", href: "/admin/settings", icon: Settings, permission: "manage_roles_permissions" },
];

const AdminLayout = () => {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Poll for unread private messages every 30s
  const fetchUnread = async () => {
    if (!user?.id) return;
    const res = await apiService.getPrivateMessages({ receiver: user.id });
    const msgs = (res.data as any)?.results || res.data || [];
    const unread = msgs.filter((m: any) => !m.is_read).length;
    setUnreadMessages(unread);
  };

  useEffect(() => {
    if (!user) return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user?.id, location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex bg-muted">
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200 fixed h-full z-40`}>
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src="/images/gpc-logo.png" alt="GPC" className="w-8 h-8 rounded-full" />
              <span className="font-bold text-sm">
                {user?.is_superuser || user?.role === 'super_admin' ? "Bishop Oversight" : "Branch Admin"}
              </span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground hover:bg-sidebar-accent">
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {sidebarItems.map((item: any) => {
            const isActive = location.pathname === item.href;
            return (
              <SmartLink 
                key={item.href} 
                to={item.href}
                permission={item.permission}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant={item.badge === "NEW" ? "default" : "secondary"} className="ml-auto text-xs h-5 px-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {!collapsed && item.href === "/admin/messages" && unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs h-5 px-1.5">{unreadMessages}</Badge>
                )}
              </SmartLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" onClick={handleLogout} className={`text-sidebar-foreground hover:bg-sidebar-accent ${collapsed ? 'w-full justify-center' : 'w-full justify-start'}`}>
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
          {!collapsed && (
            <Link to="/" className="block text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground mt-2 text-center">← Back to Website</Link>
          )}
        </div>
      </aside>
      <main className={`flex-1 ${collapsed ? 'ml-16' : 'ml-64'} transition-all duration-200`}>
        <header className="h-14 bg-background border-b border-border flex items-center px-6 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-foreground">
            {sidebarItems.find(i => i.href === location.pathname)?.title || "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            {user?.branch && <Badge variant="outline" className="text-[10px] uppercase">{user.branch}</Badge>}
            {/* Notification Bell */}
            <button
              onClick={() => navigate("/admin/messages")}
              className="relative p-1.5 rounded-lg hover:bg-muted transition-colors"
              title={unreadMessages > 0 ? `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}` : 'Messages'}
            >
              <Bell className={`h-5 w-5 ${unreadMessages > 0 ? 'text-red-500 animate-[wiggle_1s_ease-in-out_infinite]' : 'text-muted-foreground'}`} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-md">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </button>
            <div className="text-sm text-muted-foreground font-medium">{user.username}</div>
          </div>
        </header>
        <div className="p-6"><Outlet /></div>
      </main>
    </div>
  );
};

export default AdminLayout;
