import { getGrowthStatsAction } from "@/src/actions/analytics-actions";
import { AnalyticsChart } from "@/src/components/admin/analytics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ShoppingCart, TrendingUp, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  // Fetch real data
  const stats = await getGrowthStatsAction();
  
  // Calculate totals from the chart data (Last 30 days sum)
  const totalRevenue30d = stats.chartData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <p className="text-gray-400">Live system performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-1 rounded-full border border-green-500/20">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">System Operational</span>
        </div>
      </div>

      {/* 1. TOP METRICS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#111] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">New Shops (30d)</CardTitle>
            <Store className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalShops}</div>
            <p className="text-xs text-blue-500">+100% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Order Volume (30d)</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
            <p className="text-xs text-green-500">Across all shops</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">GMV (30d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{totalRevenue30d.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Gross Merchandise Value</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. VISUAL CHARTS */}
      <AnalyticsChart data={stats.chartData} />

    </div>
  );
}