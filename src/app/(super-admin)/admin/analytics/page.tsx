import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDeepAnalyticsAction } from "@/src/actions/analytics-actions";
import { RevenuePieChart } from "@/src/components/admin/advanced-charts";

export default async function AdvancedAnalyticsPage() {
  const stats = await getDeepAnalyticsAction();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Deep Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* 1. Plan Distribution (Client Component) */}
        <RevenuePieChart data={stats.planDistribution} />

        {/* 2. Shop Leaderboard (Server Component is fine for tables) */}
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader>
            <CardTitle>Top Performing Shops</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="text-gray-400">Shop Name</TableHead>
                  <TableHead className="text-gray-400 text-right">Orders</TableHead>
                  <TableHead className="text-gray-400 text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.leaderboard.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={3} className="text-center h-24 text-gray-500">No data available.</TableCell>
                   </TableRow>
                ) : (
                  stats.leaderboard.map((shop: any, i: number) => (
                    <TableRow key={i} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium flex items-center gap-2">
                         {i === 0 && <span className="text-xl">🥇</span>}
                         {i === 1 && <span className="text-xl">🥈</span>}
                         {i === 2 && <span className="text-xl">🥉</span>}
                         {shop.name}
                      </TableCell>
                      <TableCell className="text-right">{shop.orders}</TableCell>
                      <TableCell className="text-right text-green-400 font-bold">₹{shop.revenue.toLocaleString()}</TableCell>
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