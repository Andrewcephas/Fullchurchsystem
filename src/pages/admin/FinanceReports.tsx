import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";

interface Branch {
  id: string;
  branch_name: string;
  location: string;
}

interface FinanceData {
  id: string;
  amount: number;
  type: string;
  date: string;
  category: string;
  payment_method: string;
  branch_id: string;
  giver: string | null;
  is_anonymous: boolean;
  approval_status: string;
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

const FinanceReports = () => {
  const { branchId, isSuperAdmin, isBranchAdmin } = useUserRole();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(branchId || "");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch branches
  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branches")
        .select("id, branch_name, location")
        .order("branch_name");
      if (error) throw error;
      return data as Branch[];
    },
  });

  // Fetch finance data
  const { data: financeData = [] } = useQuery({
    queryKey: ["finance", selectedBranch, selectedPeriod],
    queryFn: async () => {
      let query = supabase
        .from("finance")
        .select("*")
        .order("date", { ascending: false });

      if (!isSuperAdmin && selectedBranch) {
        query = query.eq("branch_id", selectedBranch);
      } else if (isSuperAdmin && selectedBranch) {
        query = query.eq("branch_id", selectedBranch);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by date range
      const now = new Date();
      const filtered = (data as FinanceData[]).filter((item) => {
        const itemDate = new Date(item.date);
        if (selectedPeriod === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        } else if (selectedPeriod === "month") {
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return itemDate >= monthAgo;
        } else if (selectedPeriod === "year") {
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return itemDate >= yearAgo;
        }
        return true;
      });

      return filtered;
    },
    enabled: !(!isSuperAdmin && !selectedBranch),
  });

  // Calculate summary statistics
  const totalGiving = financeData.reduce((sum, item) => sum + item.amount, 0);
  const totalTithes = financeData
    .filter((item) => item.category === "tithe")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalOfferings = financeData
    .filter((item) => item.category === "offering")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalDonations = financeData
    .filter((item) => item.category === "donation")
    .reduce((sum, item) => sum + item.amount, 0);

  // Prepare chart data
  const categoryData = [
    { name: "Tithes", value: totalTithes },
    { name: "Offerings", value: totalOfferings },
    { name: "Donations", value: totalDonations },
  ].filter((item) => item.value > 0);

  // Group by date for trend
  const trendData: { [key: string]: number } = {};
  financeData.forEach((item) => {
    const dateKey = new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    trendData[dateKey] = (trendData[dateKey] || 0) + item.amount;
  });

  const trendChartData = Object.entries(trendData)
    .sort((a, b) => new Date(`${a[0]} 2024`).getTime() - new Date(`${b[0]} 2024`).getTime())
    .slice(-10)
    .map(([date, amount]) => ({
      date,
      amount,
    }));

  // Payment method breakdown
  const methodData: { [key: string]: number } = {};
  financeData.forEach((item) => {
    methodData[item.payment_method] = (methodData[item.payment_method] || 0) + item.amount;
  });

  const methodChartData = Object.entries(methodData).map(([method, amount]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: amount,
  }));

  // Top givers
  const topGivers: { [key: string]: number } = {};
  financeData.forEach((item) => {
    if (!item.is_anonymous && item.giver) {
      topGivers[item.giver] = (topGivers[item.giver] || 0) + item.amount;
    }
  });

  const topGiversData = Object.entries(topGivers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([giver, amount]) => ({
      name: giver,
      amount,
    }));

  const handleExportReport = () => {
    // Create CSV content
    const headers = ["Date", "Category", "Amount", "Payment Method", "Giver", "Status"];
    const rows = financeData.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.category,
      item.amount.toFixed(2),
      item.payment_method,
      item.is_anonymous ? "Anonymous" : item.giver || "N/A",
      item.approval_status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `finance-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance Reports</h2>
          <p className="text-muted-foreground">
            Comprehensive financial tracking and analytics
          </p>
        </div>
        <Button onClick={handleExportReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        {isSuperAdmin && (
          <div className="w-48">
            <Select value={selectedBranch || ""} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.branch_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="w-40">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Giving
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalGiving.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {financeData.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tithes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalTithes.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalTithes / totalGiving) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offerings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalOfferings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalOfferings / totalGiving) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalDonations.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalDonations / totalGiving) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Giving Trend</CardTitle>
            <CardDescription>Daily giving over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {trendChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Giving by Category</CardTitle>
            <CardDescription>Distribution of giving types</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: $${value.toFixed(0)}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>How giving is received</CardDescription>
          </CardHeader>
          <CardContent>
            {methodChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={methodChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Top Givers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Givers</CardTitle>
            <CardDescription>Most generous members (last 30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            {topGiversData.length > 0 ? (
              <div className="space-y-3">
                {topGiversData.map((giver, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1">
                      <Badge variant="outline" className="w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="truncate">{giver.name}</span>
                    </div>
                    <span className="font-semibold text-right ml-4">
                      ${giver.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest giving records</CardDescription>
        </CardHeader>
        <CardContent>
          {financeData.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {financeData.slice(0, 15).map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold capitalize text-sm">
                      {item.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.is_anonymous ? "Anonymous" : item.giver || "No name"} •{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-sm">
                      ${item.amount.toFixed(2)}
                    </p>
                    <Badge
                      variant={item.approval_status === "approved" ? "default" : "secondary"}
                      className="text-xs mt-1"
                    >
                      {item.approval_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No transactions yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceReports;
