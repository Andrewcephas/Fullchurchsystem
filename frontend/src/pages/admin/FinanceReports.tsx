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
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Branch { id: string; branch_name: string; location: string; }
interface FinanceData {
  id: string; amount: number; type: string; date: string;
  category: string; payment_method: string; branch_id: string;
  giver: string | null; is_anonymous: boolean; approval_status: string;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

const FinanceReports = () => {
  const { branchId, isSuperAdmin } = useUserRole();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Effective branch — non-superadmin always scoped to their branch
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

  // Fetch finance data
  const { data: financeData = [], isLoading } = useQuery({
    queryKey: ["finance-report", effectiveBranch, selectedPeriod],
    queryFn: async () => {
      const params: any = {};
      if (effectiveBranch) params.branch_id = effectiveBranch;

      const response = await apiService.getFinance(params);
      let data = (response.data?.results || response.data || []) as FinanceData[];

      // Filter by date range
      const now = new Date();
      if (selectedPeriod === "week") {
        const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        data = data.filter(item => new Date(item.date) >= cutoff);
      } else if (selectedPeriod === "month") {
        const cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        data = data.filter(item => new Date(item.date) >= cutoff);
      } else if (selectedPeriod === "year") {
        const cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        data = data.filter(item => new Date(item.date) >= cutoff);
      }
      return data;
    },
  });

  // Summary stats
  const totalGiving = financeData.reduce((sum, item) => sum + item.amount, 0);
  const totalTithes = financeData.filter(i => i.category === "tithe").reduce((sum, i) => sum + i.amount, 0);
  const totalOfferings = financeData.filter(i => i.category === "offering").reduce((sum, i) => sum + i.amount, 0);
  const totalDonations = financeData.filter(i => i.category === "donation").reduce((sum, i) => sum + i.amount, 0);

  const categoryData = [
    { name: "Tithes", value: totalTithes },
    { name: "Offerings", value: totalOfferings },
    { name: "Donations", value: totalDonations },
  ].filter(i => i.value > 0);

  const trendMap: Record<string, number> = {};
  financeData.forEach(item => {
    const key = new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    trendMap[key] = (trendMap[key] || 0) + item.amount;
  });
  const trendChartData = Object.entries(trendMap)
    .sort((a, b) => new Date(`${a[0]} 2024`).getTime() - new Date(`${b[0]} 2024`).getTime())
    .slice(-14)
    .map(([date, amount]) => ({ date, amount }));

  const methodMap: Record<string, number> = {};
  financeData.forEach(item => {
    const m = item.payment_method || "unknown";
    methodMap[m] = (methodMap[m] || 0) + item.amount;
  });
  const methodChartData = Object.entries(methodMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " "),
    value,
  }));

  const topGiversMap: Record<string, number> = {};
  financeData.forEach(item => {
    if (!item.is_anonymous && item.giver) topGiversMap[item.giver] = (topGiversMap[item.giver] || 0) + item.amount;
  });
  const topGiversData = Object.entries(topGiversMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([name, amount]) => ({ name, amount }));

  const handleExport = () => {
    const headers = ["Date", "Category", "Amount", "Payment Method", "Giver", "Status"];
    const rows = financeData.map(item => [
      new Date(item.date).toLocaleDateString(),
      item.category, item.amount.toFixed(2), item.payment_method,
      item.is_anonymous ? "Anonymous" : item.giver || "N/A", item.approval_status,
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `finance-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance Reports</h2>
          <p className="text-muted-foreground">Comprehensive financial tracking and analytics</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        {isSuperAdmin && (
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Branches" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Branches</SelectItem>
              {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading financial data...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Giving", value: totalGiving, pct: null },
              { label: "Tithes", value: totalTithes, pct: totalGiving ? totalTithes / totalGiving : 0 },
              { label: "Offerings", value: totalOfferings, pct: totalGiving ? totalOfferings / totalGiving : 0 },
              { label: "Donations", value: totalDonations, pct: totalGiving ? totalDonations / totalGiving : 0 },
            ].map(stat => (
              <Card key={stat.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {stat.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                  {stat.pct !== null && (
                    <p className="text-xs text-muted-foreground mt-1">{(stat.pct * 100).toFixed(1)}% of total</p>
                  )}
                  {stat.pct === null && <p className="text-xs text-muted-foreground mt-1">{financeData.length} transactions</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Giving Trend</CardTitle><CardDescription>Daily giving over selected period</CardDescription></CardHeader>
              <CardContent>
                {trendChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, "Amount"]} />
                      <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <div className="text-center text-muted-foreground py-8">No data available</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Giving by Category</CardTitle><CardDescription>Distribution of giving types</CardDescription></CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                        label={({ name, value }) => `${name}: ${(value/1000).toFixed(0)}k`}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="text-center text-muted-foreground py-8">No data available</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Payment Methods</CardTitle><CardDescription>How giving is received</CardDescription></CardHeader>
              <CardContent>
                {methodChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={methodChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, "Amount"]} />
                      <Bar dataKey="value" fill="#10b981" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="text-center text-muted-foreground py-8">No data available</div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Top Givers</CardTitle><CardDescription>Most generous members</CardDescription></CardHeader>
              <CardContent>
                {topGiversData.length > 0 ? (
                  <div className="space-y-2">
                    {topGiversData.map((g, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-6 h-6 flex items-center justify-center text-xs">{i + 1}</Badge>
                          <span className="text-sm truncate max-w-[160px]">{g.name}</span>
                        </div>
                        <span className="font-semibold text-sm">KES {g.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center text-muted-foreground py-8">No data available</div>}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader><CardTitle>Recent Transactions</CardTitle><CardDescription>Latest giving records</CardDescription></CardHeader>
            <CardContent>
              {financeData.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {financeData.slice(0, 20).map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted transition-colors">
                      <div>
                        <p className="font-semibold capitalize text-sm">{item.category?.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.is_anonymous ? "Anonymous" : item.giver || "No name"} · {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">KES {Number(item.amount).toLocaleString()}</p>
                        <Badge variant={item.approval_status === "approved" ? "default" : "secondary"} className="text-xs mt-0.5">
                          {item.approval_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="text-center text-muted-foreground py-8">No transactions yet</div>}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FinanceReports;
