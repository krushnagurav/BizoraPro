// src/app/(super-admin)/admin/page.tsx
/*
 * Admin Dashboard Page
 *
 * This page provides super administrators with an overview of key platform metrics.
 * It includes statistics on shops, revenue, growth trends, and recent activity.
 */
import { Card, CardContent } from "@/components/ui/card";
import { GrowthChart } from "@/src/components/admin/growth-chart";
import { RecentShopsTable } from "@/src/components/admin/recent-shops-table";
import { createClient } from "@/src/lib/supabase/server";
import {
  AlertCircle,
  DollarSign,
  MessageCircle,
  Store,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [shopsData, revenueData, ordersData, ticketsData] = await Promise.all([
    supabase
      .from("shops")
      .select("id, created_at, plan, is_open, name, slug")
      .order("created_at", { ascending: false }),
    supabase.from("payments").select("amount").eq("status", "succeeded"),
    supabase
      .from("orders")
      .select("id, created_at")
      .gte(
        "created_at",

        // eslint-disable-next-line react-hooks/purity
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ),
    supabase
      .from("support_tickets")
      .select("priority, status")
      .eq("status", "open"),
  ]);

  const shops = shopsData.data || [];
  const revenue = revenueData.data || [];

  const totalShops = shops.length;
  const activeShops = shops.filter((s) => s.is_open).length;
  const totalRevenue = revenue.reduce((sum, p) => sum + Number(p.amount), 0);
  const paidShops = shops.filter((s) => s.plan === "pro").length;
  const conversionRate =
    totalShops > 0 ? ((paidShops / totalShops) * 100).toFixed(1) : "0";
  const urgentTickets =
    ticketsData.data?.filter(
      (t) => t.priority === "high" || t.priority === "critical",
    ).length || 0;

  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString("default", { month: "short" });
    const shopsInMonth = shops.filter((s) => {
      const d = new Date(s.created_at);
      return (
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    }).length;
    chartData.push({ name: monthName, shops: shopsInMonth });
  }

  const stats = [
    {
      title: "Total Shops",
      value: totalShops,
      icon: Store,
      color: "text-blue-500",
      sub: `${activeShops} Active`,
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-500",
      sub: "Lifetime",
    },
    {
      title: "Paid Conversion",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-green-500",
      sub: `${paidShops} Pro Users`,
    },
    {
      title: "Weekly Orders",
      value: ordersData.data?.length || 0,
      icon: MessageCircle,
      color: "text-purple-500",
      sub: "Last 7 Days",
    },
    {
      title: "Urgent Support",
      value: urgentTickets,
      icon: AlertCircle,
      color: "text-red-500",
      sub: "Open Tickets",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
        <p className="text-gray-400">Real-time pulse of your SaaS business.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((item, i) => (
          <Card key={i} className="bg-[#111] border-white/10 text-white">
            <CardContent className="p-6 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{item.value}</h3>
                <p className="text-xs text-gray-500">{item.title}</p>
                <p className="text-[10px] text-gray-600 mt-1">{item.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <GrowthChart data={chartData} />
        <RecentShopsTable shops={shops.slice(0, 5)} />
      </div>
    </div>
  );
}
