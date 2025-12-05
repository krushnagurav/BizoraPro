import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/src/lib/supabase/server";
import { Eye, IndianRupee, MessageCircle, Store } from "lucide-react";

export async function StatsCards({ shopId }: { shopId: string }) {
  const supabase = await createClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isoDate = sevenDaysAgo.toISOString();

  const [views, clicks, products, revenue] = await Promise.all([
    supabase
      .from("analytics")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shopId)
      .eq("event_type", "view_shop")
      .gte("created_at", isoDate),
    supabase
      .from("analytics")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shopId)
      .eq("event_type", "click_whatsapp")
      .gte("created_at", isoDate),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shopId)
      .is("deleted_at", null),
    supabase
      .from("orders")
      .select("total_amount")
      .eq("shop_id", shopId)
      .neq("status", "draft"),
  ]);

  const totalRevenue =
    revenue.data?.reduce((acc, order) => acc + Number(order.total_amount), 0) ||
    0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`₹${totalRevenue.toLocaleString()}`}
        icon={IndianRupee}
        color="text-green-500"
      />
      <StatCard
        title="Store Views (7d)"
        value={views.count || 0}
        icon={Eye}
        color="text-blue-500"
      />
      <StatCard
        title="WhatsApp Clicks"
        value={clicks.count || 0}
        icon={MessageCircle}
        color="text-green-500"
      />
      <StatCard
        title="Active Products"
        value={products.count || 0}
        icon={Store}
        color="text-purple-500"
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <Icon className={`h-8 w-8 ${color} opacity-20`} />
      </CardContent>
    </Card>
  );
}
