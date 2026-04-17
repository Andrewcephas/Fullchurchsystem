import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Activity,
} from "lucide-react";

interface Branch {
  id: string;
  branch_name: string;
  location: string;
}

interface Member {
  id: string;
  branch_id: string;
}

interface Attendance {
  id: string;
  count: number;
  date: string;
  branch_id: string;
  service_type: string;
}

interface Finance {
  id: string;
  amount: number;
  date: string;
  branch_id: string;
}

const AnalyticsEnhanced = () => {
  const { branchId, isSuperAdmin } = useUserRole();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(branchId || "");
  const [selectedMetric, setSelectedMetric] = useState("growth");

   // Fetch branches
   const { data: branches = [] } = useQuery({
     queryKey: ["branches"],
     queryFn: async () => {
       const response = await apiService.getBranches();
       return (response.data?.results || response.data || []) as Branch[];
     },
   });

   // Fetch members
   const { data: members = [] } = useQuery({
     queryKey: ["members"],
     queryFn: async () => {
       const params: any = {};
       if (!isSuperAdmin && selectedBranch) {
         params.branch_id = selectedBranch;
       }
       const response = await apiService.getMembers(params);
       return (response.data?.results || response.data || []) as Member[];
     },
   });

   // Fetch attendance data
   const { data: attendanceData = [] } = useQuery({
     queryKey: ["attendance", selectedBranch],
     queryFn: async () => {
       const params: any = {};
       if (!isSuperAdmin && selectedBranch) {
         params.branch_id = selectedBranch;
       } else if (isSuperAdmin && selectedBranch) {
         params.branch_id = selectedBranch;
       }
       const response = await apiService.getAttendance(params);
       return (response.data?.results || response.data || []) as Attendance[];
     },
   });

   // Fetch finance data
   const { data: financeData = [] } = useQuery({
     queryKey: ["finance", selectedBranch],
     queryFn: async () => {
       const params: any = {};
       if (!isSuperAdmin && selectedBranch) {
         params.branch_id = selectedBranch;
       } else if (isSuperAdmin && selectedBranch) {
         params.branch_id = selectedBranch;
       }
       const response = await apiService.getFinance(params);
       return (response.data?.results || response.data || []) as Finance[];
     },
   });

  // Calculate statistics
  const membersByBranch: { [key: string]: number } = {};
  members.forEach((member) => {
    const branchName =
      branches.find((b) => b.id === member.branch_id)?.branch_name || "Unknown";
    membersByBranch[branchName] = (membersByBranch[branchName] || 0) + 1;
  });

  const memberGrowthData = Object.entries(membersByBranch).map(([branch, count]) => ({
    name: branch,
    members: count,
  }));

  // Average attendance
  const attendanceByDate: { [key: string]: { count: number; date: string } } = {};
  attendanceData.forEach((record) => {
    const dateKey = new Date(record.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!attendanceByDate[dateKey]) {
      attendanceByDate[dateKey] = { count: 0, date: record.date };
    }
    attendanceByDate[dateKey].count += record.count;
  });

  const attendanceTrendData = Object.values(attendanceByDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      attendance: item.count,
    }));

  // Financial trends
  const financeByDate: { [key: string]: { amount: number; date: string } } = {};
  financeData.forEach((record) => {
    const dateKey = new Date(record.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!financeByDate[dateKey]) {
      financeByDate[dateKey] = { amount: 0, date: record.date };
    }
    financeByDate[dateKey].amount += record.amount;
  });

  const financeTrendData = Object.values(financeByDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: item.amount,
    }));

  // Calculate KPIs
  const totalMembers = members.length;
  const totalAttendance = attendanceData.reduce((sum, item) => sum + item.count, 0);
  const avgAttendance =
    attendanceData.length > 0
      ? (totalAttendance / attendanceData.length).toFixed(0)
      : "0";
  const totalFinance = financeData.reduce((sum, item) => sum + item.amount, 0);
  const avgFinance =
    financeData.length > 0 ? (totalFinance / financeData.length).toFixed(2) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive church growth and performance metrics
        </p>
      </div>

      {/* Filters */}
      {isSuperAdmin && (
        <div className="flex gap-4">
          <Select value={selectedBranch || ""} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-48">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Avg. Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendance}</div>
            <p className="text-xs text-muted-foreground mt-1">Per service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Giving
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalFinance.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: ${avgFinance} per record
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Member Distribution</CardTitle>
            <CardDescription>Members by branch</CardDescription>
          </CardHeader>
          <CardContent>
            {memberGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="members" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No member data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <CardDescription>Service attendance over time</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#10b981"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No attendance data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Giving trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            {financeTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={financeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    fill="#f59e0b"
                    stroke="#d97706"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No financial data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {attendanceTrendData.length > 0 && (
            <div className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Average Service Attendance</p>
                  <p className="text-sm text-muted-foreground">
                    Your average service attendance is {avgAttendance} members. Consider
                    implementing strategies to increase attendance.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 border rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Growing Membership</p>
                <p className="text-sm text-muted-foreground">
                  You have {totalMembers} registered members across {branches.length}{" "}
                  branches. Focus on welcoming new members and providing pastoral care.
                </p>
              </div>
            </div>
          </div>

          {financeTrendData.length > 0 && (
            <div className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Financial Health</p>
                  <p className="text-sm text-muted-foreground">
                    Total giving is ${totalFinance.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                    . Monitor giving trends and plan budgets accordingly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsEnhanced;
