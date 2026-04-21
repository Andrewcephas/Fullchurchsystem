import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, DollarSign, Calendar, Activity } from "lucide-react";

interface Branch { id: string; branch_name: string; location: string; }
interface Member { id: string; branch_id: string; date_joined?: string; }
interface Attendance { id: string; count: number; date: string; branch_id: string; service_type: string; }
interface Finance { id: string; amount: number; date: string; branch_id: string; }

const AnalyticsEnhanced = () => {
  const { branchId, isSuperAdmin } = useUserRole();
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // Effective branch: non-super admins always scoped to their branch
  const effectiveBranch = isSuperAdmin ? (selectedBranch || null) : branchId;

  // Fetch branches (super admin only)
  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await apiService.getBranches();
      return (response.data?.results || response.data || []) as Branch[];
    },
    enabled: isSuperAdmin,
  });

  // Fetch members
  const { data: members = [] } = useQuery({
    queryKey: ["analytics-members", effectiveBranch],
    queryFn: async () => {
      const params: any = {};
      if (effectiveBranch) params.branch_id = effectiveBranch;
      const response = await apiService.getMembers(params);
      return (response.data?.results || response.data || []) as Member[];
    },
  });

  // Fetch attendance
  const { data: attendanceData = [] } = useQuery({
    queryKey: ["analytics-attendance", effectiveBranch],
    queryFn: async () => {
      const params: any = {};
      if (effectiveBranch) params.branch_id = effectiveBranch;
      const response = await apiService.getAttendance(params);
      return (response.data?.results || response.data || []) as Attendance[];
    },
  });

  // Fetch finance
  const { data: financeData = [] } = useQuery({
    queryKey: ["analytics-finance", effectiveBranch],
    queryFn: async () => {
      const params: any = {};
      if (effectiveBranch) params.branch_id = effectiveBranch;
      const response = await apiService.getFinance(params);
      return (response.data?.results || response.data || []) as Finance[];
    },
  });

  // Member distribution by branch
  const membersByBranch: Record<string, number> = {};
  members.forEach(m => {
    const name = branches.find(b => b.id === m.branch_id)?.branch_name || "Branch";
    membersByBranch[name] = (membersByBranch[name] || 0) + 1;
  });
  const memberDistData = Object.entries(membersByBranch).map(([name, members]) => ({ name, members }));

  // Attendance trend
  const attByDate: Record<string, { count: number; date: string }> = {};
  attendanceData.forEach(r => {
    const key = new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!attByDate[key]) attByDate[key] = { count: 0, date: r.date };
    attByDate[key].count += r.count;
  });
  const attendanceTrendData = Object.values(attByDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14)
    .map(item => ({ date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), attendance: item.count }));

  // Finance trend
  const finByDate: Record<string, { amount: number; date: string }> = {};
  financeData.forEach(r => {
    const key = new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!finByDate[key]) finByDate[key] = { amount: 0, date: r.date };
    finByDate[key].amount += r.amount;
  });
  const financeTrendData = Object.values(finByDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14)
    .map(item => ({ date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), amount: item.amount }));

  // KPIs
  const totalMembers = members.length;
  const totalAttendance = attendanceData.reduce((s, i) => s + i.count, 0);
  const avgAttendance = attendanceData.length > 0 ? Math.round(totalAttendance / attendanceData.length) : 0;
  const totalFinance = financeData.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive church growth and performance metrics</p>
      </div>

      {/* Filters */}
      {isSuperAdmin && (
        <div className="flex gap-4">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Branches" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Branches</SelectItem>
              {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Members", value: totalMembers.toString(), sub: "Registered" },
          { icon: Calendar, label: "Avg Attendance", value: avgAttendance.toString(), sub: "Per service" },
          { icon: DollarSign, label: "Total Giving", value: `KES ${totalFinance.toLocaleString()}`, sub: `${financeData.length} transactions` },
          { icon: Activity, label: "Branches", value: branches.length > 0 ? branches.length.toString() : (effectiveBranch ? "1" : "—"), sub: "Active locations" },
        ].map(stat => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <stat.icon className="h-4 w-4" />{stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isSuperAdmin && (
          <Card>
            <CardHeader><CardTitle>Member Distribution</CardTitle><CardDescription>Members by branch</CardDescription></CardHeader>
            <CardContent>
              {memberDistData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={memberDistData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="members" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-muted-foreground py-8">No member data available</p>}
            </CardContent>
          </Card>
        )}

        <Card className={!isSuperAdmin ? "lg:col-span-2" : ""}>
          <CardHeader><CardTitle>Attendance Trend</CardTitle><CardDescription>Service attendance over time</CardDescription></CardHeader>
          <CardContent>
            {attendanceTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-8">No attendance data available</p>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Giving Trends</CardTitle><CardDescription>Financial giving over time (KES)</CardDescription></CardHeader>
          <CardContent>
            {financeTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={financeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, "Amount"]} />
                  <Area type="monotone" dataKey="amount" fill="#f59e0b" stroke="#d97706" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-muted-foreground py-8">No financial data available</p>}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader><CardTitle>Insights & Recommendations</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Average Service Attendance</p>
                <p className="text-sm text-muted-foreground">
                  Average attendance is <strong>{avgAttendance}</strong> per service.
                  {avgAttendance < 50 ? " Consider strategies to increase visibility and engagement." : " Great engagement! Keep up the momentum."}
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 border rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Membership Overview</p>
                <p className="text-sm text-muted-foreground">
                  <strong>{totalMembers}</strong> registered members{isSuperAdmin && branches.length > 0 ? ` across ${branches.length} branches` : ""}. 
                  Focus on welcoming new members and providing pastoral care.
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 border rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Financial Health</p>
                <p className="text-sm text-muted-foreground">
                  Total giving: <strong>KES {totalFinance.toLocaleString()}</strong>.
                  Monitor giving trends and plan budgets accordingly.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsEnhanced;
