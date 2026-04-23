import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Calendar, ClipboardCheck, Heart, Building2, Cake, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import apiService from "@/services/api";
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
      const branchParams = branchFilter ? { branch_id: branchFilter } : undefined;

      const [mRes, aRes, fRes, eRes, pRes, brRes] = await Promise.all([
        apiService.getMembers(branchParams),
        apiService.getAttendance(branchParams),
        apiService.getFinance(branchParams),
        apiService.getEvents(branchParams),
        apiService.getPrayerRequests({ status: "new", ...(branchFilter ? { branch_id: branchFilter } : {}) }),
        apiService.getBranches()
      ]);

      const members = mRes.data?.results || mRes.data || [];
      const attendance = aRes.data?.results || aRes.data || [];
      const finance = fRes.data?.results || fRes.data || [];
      const events = eRes.data?.results || eRes.data || [];

      const totalFinance = finance.reduce((sum: number, r: any) => sum + Number(r.amount), 0);
      const avgAttendance = attendance.length > 0 ? Math.round(attendance.reduce((sum: number, r: any) => sum + r.count, 0) / attendance.length) : 0;
      
      setStats({ 
        members: members.length, 
        attendance: avgAttendance, 
        finance: totalFinance, 
        events: events.length, 
        prayers: pRes.data?.count || pRes.data?.results?.length || 0, 
        branches: brRes.data?.results?.length || brRes.data?.length || 0 
      });
    };

    const fetchBirthdays = async () => {
      const params = branchFilter ? { branch_id: branchFilter } : undefined;
      const response = await apiService.getMembers(params);
      const data = response.data?.results || response.data || [];
      
      const today = new Date();
      const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      setBirthdays(data.filter((m: any) => {
        if (!m.date_of_birth) return false;
        const d = new Date(m.date_of_birth);
        return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` === todayMD;
      }));

      setUpcomingBirthdays(data.filter((m: any) => {
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
        const loginsResponse = await apiService.getLoginActivity({ limit: 5 });
        setRecentLogins(loginsResponse.data?.results || loginsResponse.data || []);
      }
      const noticesResponse = await apiService.getNotices(branchFilter ? { branch_id: branchFilter } : { limit: 3 });
      setNotices(noticesResponse.data?.results || noticesResponse.data || []);
    };

    fetchStats();
    fetchBirthdays();
    fetchExtras();
  }, [branchFilter, roleLoading, isSuperAdmin]);

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
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-foreground">
            {isSuperAdmin ? "Bishop's Global Oversight" : "Branch Operations Dashboard"}
          </h2>
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

      {/* Birthday Notifications with Glitter */}
      {birthdays.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-r from-amber-50/80 via-pink-50/50 to-purple-50/50 dark:from-amber-900/20 dark:via-pink-900/10 dark:to-purple-900/10 overflow-hidden relative">
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="confetti-particle"
                style={{
                  left: `${(i * 8.5) % 100}%`,
                  top: `-${i % 3 * 5}px`,
                  backgroundColor: ['#f59e0b','#ec4899','#8b5cf6','#10b981','#3b82f6','#ef4444'][i % 6],
                  animationDelay: `${i * 0.18}s`,
                  animationDuration: `${1.8 + (i % 4) * 0.3}s`,
                  borderRadius: i % 3 === 0 ? '0' : '50%',
                  width: i % 2 === 0 ? '6px' : '8px',
                  height: i % 2 === 0 ? '10px' : '8px',
                }}
              />
            ))}
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cake className="h-5 w-5 text-amber-500 animate-sparkle" />
              <span className="text-amber-700 dark:text-amber-300">🎉 Today's Birthdays!</span>
              <span className="animate-sparkle text-lg">✨</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {birthdays.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-white/10 rounded-xl backdrop-blur-sm border border-amber-200/50">
                  <div className="text-2xl animate-sparkle">🎂</div>
                  <div>
                    <p className="font-bold text-foreground">Happy Birthday, {m.name}! 🎊</p>
                    <p className="text-xs text-muted-foreground">Wishing you God's blessings today and always!</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Notices */}
      <div className="grid lg:grid-cols-2 gap-6">
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

        {isSuperAdmin && recentLogins.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Recent Staff Logins</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentLogins.map(l => (
                  <div key={l.id} className="flex justify-between items-center text-sm p-2 border-b last:border-0">
                    <span className="font-medium">{l.user_email}</span>
                    <span className="text-xs text-muted-foreground">{new Date(l.login_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
