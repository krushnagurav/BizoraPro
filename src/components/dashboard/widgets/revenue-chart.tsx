// src/components/dashboard/widgets/revenue-chart.tsx
/*  * Revenue Chart Component
 * This component fetches and displays a revenue
 * trend chart for the last 30 days in the dashboard
 * using the SalesChart component.
 */
import { SalesChart } from "@/src/components/dashboard/sales-chart";
import { createClient } from "@/src/lib/supabase/server";

export async function RevenueChart({ shopId }: { shopId: string }) {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("shop_id", shopId)
    .neq("status", "draft")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const chartDataMap = new Map();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    chartDataMap.set(key, { date: key, revenue: 0 });
  }
  data?.forEach((order) => {
    const key = new Date(order.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (chartDataMap.has(key))
      chartDataMap.get(key).revenue += order.total_amount;
  });

  return (
    <div className="lg:col-span-2">
      <SalesChart data={Array.from(chartDataMap.values())} />
    </div>
  );
}
