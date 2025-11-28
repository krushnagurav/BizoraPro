import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Store, 
  DollarSign, 
  TrendingUp, 
  MessageCircle, 
  Eye, 
  Headphones 
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoIso = sevenDaysAgo.toISOString();

  // 1. Fetch Real Counts (Basic)
  const { count: totalShops } = await supabase.from("shops").select("*", { count: 'exact', head: true });
  const { count: activeShops } = await supabase.from("shops").select("*", { count: 'exact', head: true }).eq("is_open", true);
  const { count: orders7d } = await supabase.from("orders").select("*", { count: 'exact', head: true }).gte("created_at", sevenDaysAgoIso);

  // Mock Data for Advanced Metrics (Until we build full analytics engine)
  // In Phase 3, we will replace these with real DB aggregations
  const stats = [
    {
      title: "Total Shops",
      value: totalShops || 0,
      subLabel: `Active: ${activeShops} | Suspended: ${(totalShops || 0) - (activeShops || 0)}`,
      icon: Store,
      color: "text-blue-500",
      trend: "+12%",
      trendColor: "text-green-500"
    },
    {
      title: "Total Revenue",
      value: "₹2,84,750",
      subLabel: "MRR: ₹47k | ARR: ₹564k",
      icon: DollarSign,
      color: "text-yellow-500",
      trend: "+24%",
      trendColor: "text-green-500"
    },
    {
      title: "Trial Conversion",
      value: "68.4%",
      subLabel: "Trial: 412 | Converted: 282",
      icon: TrendingUp,
      color: "text-orange-500",
      trend: "+8%",
      trendColor: "text-green-500"
    },
    {
      title: "WhatsApp Orders (7d)",
      value: orders7d || 0,
      subLabel: `Avg: ${Math.round((orders7d || 0) / 7)} / day`,
      icon: MessageCircle,
      color: "text-green-500",
      trend: "+18%",
      trendColor: "text-green-500"
    },
    {
      title: "Platform Traffic (7d)",
      value: "487,234",
      subLabel: "Unique: 124k",
      icon: Eye,
      color: "text-cyan-500",
      trend: "-3%",
      trendColor: "text-red-500"
    },
    {
      title: "Support Queue",
      value: "23",
      subLabel: "Urgent: 7 | Normal: 16",
      icon: Headphones,
      color: "text-purple-500",
      trend: "0%",
      trendColor: "text-gray-500"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
          <p className="text-gray-400">Monitor and manage your entire platform ecosystem</p>
        </div>
        <button className="bg-[#E6B800] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#FFD700] transition">
          + Add New Shop Owner
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((item, i) => (
          <Card key={i} className="bg-[#111] border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{item.title}</CardTitle>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${item.trendColor}`}>{item.trend}</span>
                <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                   <item.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{item.value}</div>
              <p className="text-xs text-gray-500">{item.subLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GRAPH SECTION (Placeholder for now) */}
      <Card className="bg-[#111] border-white/10 text-white h-[300px] flex items-center justify-center">
        <div className="text-center">
           <p className="text-lg font-bold">Platform Growth</p>
           <p className="text-sm text-gray-500">Monthly trends for new shops and order requests</p>
        </div>
      </Card>
    </div>
  );
}