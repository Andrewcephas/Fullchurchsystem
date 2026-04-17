import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Calendar, ClipboardCheck, Heart, TrendingUp, Building2, Cake, GraduationCap, Bell, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";
import BranchSelector from "@/components/admin/BranchSelector";

const Dashboard = () => {
  const { isSuperAdmin, branchId: userBranch, loading: roleLoading } = useUserRole();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [stats, setStats] = useState({ members: 0, attendance: 0, finance: 0, events: 0, prayers: 0, branches: 0 });
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([]);
  const [recentLogins, setRecentLogins] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

  useEffect(() => {
    if (roleLoading) return;
    const fetchStats = async () => {
      let mQ = supabase.from("members").select("id", { count: "exact", head: true });
      let aQ = supabase.from("attendance").select("count").order("date", { ascending: false }).limit(5);
      let fQ = supabase.from("finance").select("amount");
      let eQ = supabase.from("events").select("id", { count: "exact", head: true });
      const pQ = supabase.from("prayer_requests").select("id", { count: "exact", head: true }).eq("status", "new");

      if (branchFilter) {
        mQ = mQ.eq("branch_id", branchFilter);
        aQ = aQ.eq("branch_id", branchFilter);
        fQ = fQ.eq("branch_id", branchFilter);
        eQ = eQ.eq("branch_id", branchFilter);
      }

      const [m, a, f, e, p, br] = await Promise.all([mQ, aQ, fQ, eQ, pQ,
        supabase.from("branches").select("id", { count: "exact", head: true })]);

      const totalFinance = (f.data || []).reduce((sum, r) => sum + Number(r.amount), 0);
      const avgAttendance = (a.data || []).length > 0 ? Math.round((a.data || []).reduce((sum, r) => sum + r.count, 0) / (a.data || []).length) : 0;
      setStats({ members: m.count || 0, attendance: avgAttendance, finance: totalFinance, events: e.count || 0, prayers: p.count || 0, branches: br.count || 0 });
    };

    const fetchBirthdays = async () => {
      let q = supabase.from("members").select("id, name, date_of_birth, branch_id").not("date_of_birth", "is", null);
      if (branchFilter) q = q.eq("branch_id", branchFilter);
      const { data } = await q;
      if (!data) return;

      const today = new Date();
      const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      setBirthdays(data.filter(m => {
        if (!m.date_of_birth) return false;
        const d = new Date(m.date_of_birth);
        return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` === todayMD;
      }));

      setUpcomingBirthdays(data.filter(m => {
        if (!m.date_of_birth) return false;
        const d = new Date(m.date_of_birth);
        const bday = new Date(today.getFullYear(), d.getMonth(), d.getDate());
        if (bday < today) bday.setFullYear(bday.getFullYear() + 1);
        const diff = (bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 7;
      }));
    };

    const fetchExtras = async () => {
      if (isSuperAdmin) {
        const { data: logins } = await supabase.from("login_activity").select("*").order("login_at", { ascending: false }).limit(5);
        if (logins) setRecentLogins(logins);
      }
      const { data: n } = await supabase.from("notices").select("*").order("created_at", { ascending: false }).limit(3);
      if (n) setNotices(n);
    };

    fetchStats();
    fetchBirthdays();
    fetchExtras();
  }, [branchFilter, roleLoading]);

  const cards = [
    ...(isSuperAdmin ? [{ title: "Total Branches", value: stats.branches.toString(), icon: Building2, desc: "All locations" }] : []),
    { title: "Total Members", value: stats.members.toString(), icon: Users, desc: "Registered members" },
    { title: "Avg Attendance", value: stats.attendance.toString(), icon: ClipboardCheck, desc: "Recent services" },
    { title: "Total Giving", value: `KES ${stats.finance.toLocaleString()}`, icon: DollarSign, desc: "All time" },
    { title: "Upcoming Events", value: stats.events.toString(), icon: Calendar, desc: "Scheduled" },
    { title: "Prayer Requests", value: stats.prayers.toString(), icon: Heart, desc: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome to GPC Admin</h2>
          <p className="text-muted-foreground">Global Power Church Management Dashboard</p>
        </div>
        {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Birthday Notifications */}
      {birthdays.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader><CardTitle className="flex items-center gap-2"><Cake className="h-5 w-5 text-primary" />🎉 Today's Birthdays</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {birthdays.map(m => <p key={m.id} className="text-foreground">🎂 Today is <strong>{m.name}</strong>'s Birthday!</p>)}
            </div>
          </CardContent>
        </Card>
      )}

      {upcomingBirthdays.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Cake className="h-5 w-5 text-muted-foreground" />Upcoming Birthdays (Next 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {upcomingBirthdays.map(m => {
                const d = new Date(m.date_of_birth);
                return <p key={m.id} className="text-sm text-muted-foreground">{m.name} — {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Notices */}
      {notices.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Recent Notices</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notices.map(n => (
                <div key={n.id} className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{n.title}</p>
                    {n.is_global && <Badge className="bg-primary text-primary-foreground text-xs">Global</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{n.content.slice(0, 100)}{n.content.length > 100 ? "..." : ""}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Super Admin: Recent Login Activity */}
      {isSuperAdmin && recentLogins.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><LogIn className="h-5 w-5 text-primary" />Recent Login Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentLogins.map(l => (
                <div key={l.id} className="flex justify-between text-sm p-2 bg-muted rounded">
                  <span className="text-foreground">{l.user_email || l.user_id.slice(0, 8)}</span>
                  <span className="text-muted-foreground">{new Date(l.login_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
