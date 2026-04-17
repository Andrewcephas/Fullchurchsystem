import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, ClipboardCheck, DollarSign, Calendar, Book,
  MessageSquare, Heart, BarChart3, LogOut, Menu, ChevronLeft, Settings, Sparkles,
  Building2, GraduationCap, Shield, Bell, Mail, UserPlus, ArrowRightLeft, TrendingUp,
  HardDrive, Bell as NotificationIcon
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Branches", href: "/admin/branches", icon: Building2 },
  { title: "Members", href: "/admin/members", icon: Users },
  { title: "Member Profiles", href: "/admin/member-profiles", icon: UserPlus, badge: "NEW" },
  { title: "Member Transfers", href: "/admin/member-transfers", icon: ArrowRightLeft, badge: "NEW" },
  { title: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
  { title: "Finance", href: "/admin/finance", icon: DollarSign },
  { title: "Finance Reports", href: "/admin/finance-reports", icon: TrendingUp, badge: "NEW" },
  { title: "Events", href: "/admin/events", icon: Calendar },
  { title: "Sermons", href: "/admin/sermons", icon: Book },
  { title: "Sunday School", href: "/admin/sunday-school", icon: GraduationCap },
  { title: "Notices", href: "/admin/notices", icon: Bell },
  { title: "Messages", href: "/admin/messages", icon: Mail },
  { title: "Communications", href: "/admin/communications", icon: MessageSquare },
  { title: "Prayer Requests", href: "/admin/prayer-requests", icon: Heart },
  { title: "Social Quotes", href: "/admin/social-quotes", icon: Sparkles },
  { title: "Notifications", href: "/admin/notifications", icon: NotificationIcon, badge: "NEW" },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Analytics Enhanced", href: "/admin/analytics-enhanced", icon: TrendingUp, badge: "ENHANCED" },
  { title: "Backup & Security", href: "/admin/backup-security", icon: HardDrive, badge: "NEW" },
  { title: "User Roles", href: "/admin/user-roles", icon: Shield },
  { title: "Settings", href: "/admin/settings", icon: Settings },
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

  // Check unread messages (placeholder - will be implemented with API)
  useEffect(() => {
    if (!user) return;
    // TODO: Implement unread messages count with Django API
    setUnreadMessages(0);
  }, [user, location]);

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
              <span className="font-bold text-sm">GPC Admin</span>
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
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
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
              </Link>
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
          <div className="ml-auto text-sm text-muted-foreground">{user.username}</div>
        </header>
        <div className="p-6"><Outlet /></div>
      </main>
    </div>
  );
};

export default AdminLayout;
