import { getAdminStats } from "@/src/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ShoppingCart, DollarSign, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
        <p className="text-gray-400">Welcome back, Boss.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { title: "Total Shops", value: stats.totalShops, icon: Store, color: "text-blue-500" },
          { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-green-500" },
          { title: "Revenue (Est)", value: "₹0", icon: DollarSign, color: "text-yellow-500" }, // Placeholder until payments logic
          { title: "Active Users", value: stats.totalShops, icon: Users, color: "text-purple-500" },
        ].map((item, i) => (
          <Card key={i} className="bg-[#111] border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{item.title}</CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}