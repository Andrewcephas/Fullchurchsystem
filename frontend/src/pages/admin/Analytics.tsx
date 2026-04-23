import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign, Building2 } from "lucide-react";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import BranchSelector from "@/components/admin/BranchSelector";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const COLORS = ["hsl(280, 85%, 45%)", "hsl(45, 100%, 50%)", "hsl(280, 60%, 60%)", "hsl(45, 80%, 60%)", "hsl(280, 40%, 70%)", "hsl(200, 60%, 50%)"];

const Analytics = () => {
  const { isSuperAdmin, branchId: userBranch } = useUserRole();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [data, setData] = useState({ members: 0, avgAttendance: 0, totalGiving: 0, pendingPrayers: 0, branches: 0 });
  const [genderData, setGenderData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const branchFilter = isSuperAdmin ? (selectedBranch === "all" ? null : selectedBranch) : userBranch;

   useEffect(() => {
     const fetchAll = async () => {
       const membersParams = branchFilter ? { branch_id: branchFilter } : undefined;
       const attendanceParams = branchFilter ? { branch_id: branchFilter } : undefined;
       const financeParams = branchFilter ? { branch_id: branchFilter } : undefined;

       const [mRes, aRes, fRes, pRes, brRes] = await Promise.all([
         apiService.getMembers(membersParams),
         apiService.getAttendance(attendanceParams),
         apiService.getFinance(financeParams),
         apiService.getPrayerRequests({ status: "new", ...(branchFilter ? { branch_id: branchFilter } : {}) }),
         apiService.getBranches()
       ]);

       const members = mRes.data?.results || mRes.data || [];
       const attendance = aRes.data?.results || aRes.data || [];
       const finance = fRes.data?.results || fRes.data || [];

       setData({
         members: members.length,
         avgAttendance: attendance.length > 0 ? Math.round(attendance.reduce((s: number, r: any) => s + r.count, 0) / attendance.length) : 0,
         totalGiving: finance.reduce((s: number, r: any) => s + Number(r.amount), 0),
         pendingPrayers: pRes.data?.count || 0,
         branches: brRes.data?.results?.length || brRes.data?.length || 0,
       });

       // Gender distribution
       const genderMap: Record<string, number> = {};
       members.forEach((m: any) => { const g = m.gender || "Unknown"; genderMap[g] = (genderMap[g] || 0) + 1; });
       setGenderData(Object.entries(genderMap).map(([name, value]) => ({ name, value })));

       // Category distribution
       const catMap: Record<string, number> = {};
       members.forEach((m: any) => { const c = m.member_category || "Adult"; catMap[c] = (catMap[c] || 0) + 1; });
       setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

       // Finance by month
       const fMonthMap: Record<string, number> = {};
       finance.forEach((f: any) => {
         const month = f.date.substring(0, 7);
         fMonthMap[month] = (fMonthMap[month] || 0) + Number(f.amount);
       });
       setFinanceData(Object.entries(fMonthMap).slice(-12).map(([month, amount]) => ({ month, amount })));

       // Attendance trend
       const aMonthMap: Record<string, { total: number; count: number }> = {};
       attendance.forEach((a: any) => {
         const month = a.date.substring(0, 7);
         if (!aMonthMap[month]) aMonthMap[month] = { total: 0, count: 0 };
         aMonthMap[month].total += a.count;
         aMonthMap[month].count += 1;
       });
       setAttendanceData(Object.entries(aMonthMap).slice(-12).map(([month, d]) => ({ month, avg: Math.round(d.total / d.count) })));
     };
     fetchAll();
   }, [selectedBranch, userBranch]);

  const stats = [
    ...(isSuperAdmin ? [{ title: "Total Branches", value: data.branches.toString(), icon: Building2, desc: "All locations" }] : []),
    { title: "Total Members", value: data.members.toString(), icon: TrendingUp, desc: "All time" },
    { title: "Avg Attendance", value: data.avgAttendance.toString(), icon: Users, desc: "Per service" },
    { title: "Total Giving", value: `KES ${data.totalGiving.toLocaleString()}`, icon: DollarSign, desc: "All time" },
    { title: "Prayer Requests", value: data.pendingPrayers.toString(), icon: BarChart3, desc: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Analytics & Reports</h2>
        {isSuperAdmin && <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Member Gender Distribution</CardTitle></CardHeader>
          <CardContent>
            {genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-center py-8">No data</p>}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Member Categories</CardTitle></CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(280, 85%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-center py-8">No data</p>}
          </CardContent>
        </Card>

        {/* Financial Trends */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Monthly Giving (KES)</CardTitle></CardHeader>
          <CardContent>
            {financeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="hsl(45, 100%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-center py-8">No data</p>}
          </CardContent>
        </Card>

        {/* Attendance Trends */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Attendance Trend</CardTitle></CardHeader>
          <CardContent>
            {attendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avg" stroke="hsl(280, 85%, 45%)" strokeWidth={2} dot={{ fill: "hsl(280, 85%, 45%)" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-center py-8">No data</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
