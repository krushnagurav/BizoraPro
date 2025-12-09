import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDeepAnalyticsAction } from "@/src/actions/analytics-actions";
import {
  GrowthLineChart,
  RevenueBarChart,
  RevenuePieChart,
} from "@/src/components/admin/advanced-charts";
import { Calendar } from "lucide-react";

export default async function AdvancedAnalyticsPage() {
  const stats = await getDeepAnalyticsAction();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Deep Analytics</h1>
          <p className="text-gray-400">
            Platform performance and health metrics.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-white/10 text-white hover:bg-white/5 gap-2"
        >
          <Calendar className="h-4 w-4" /> Last 6 Months
        </Button>
      </div>

      {/* Row 1: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <RevenueBarChart data={stats.revenueData} />
        <RevenuePieChart data={stats.planDistribution} />
      </div>

      {/* Row 2: Growth & Leaderboard */}
      <div className="grid lg:grid-cols-3 gap-6">
        <GrowthLineChart data={stats.growthData} />

        {/* Shop Leaderboard */}
        <Card className="bg-[#111] border-white/10 text-white lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Shops</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10 bg-white/5">
                  <TableHead className="text-gray-400 pl-6">Rank</TableHead>
                  <TableHead className="text-gray-400">Shop Name</TableHead>
                  <TableHead className="text-gray-400 text-right">
                    Orders
                  </TableHead>
                  <TableHead className="text-gray-400 text-right pr-6">
                    Revenue
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center h-24 text-gray-500"
                    >
                      No data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.leaderboard.map((shop: any, i: number) => (
                    <TableRow
                      key={i}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="pl-6">
                        {i === 0
                          ? "🥇"
                          : i === 1
                            ? "🥈"
                            : i === 2
                              ? "🥉"
                              : `#${i + 1}`}
                      </TableCell>
                      <TableCell className="font-bold text-white">
                        {shop.shop_name}
                      </TableCell>
                      <TableCell className="text-right">
                        {shop.total_orders}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-400 pr-6">
                        ₹{shop.total_revenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
