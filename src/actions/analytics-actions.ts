"use server";

import { createClient } from "@/src/lib/supabase/server";

export async function getGrowthStatsAction() {
  const supabase = await createClient();
  
  // 1. Get data for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: shops } = await supabase
    .from("shops")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .gte("created_at", thirtyDaysAgo.toISOString());

  // 2. Process Data for Charts
  // We want an array: [{ date: "Nov 24", shops: 5, orders: 12 }, ...]
  const chartData = [];
  const dateMap = new Map();

  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateMap.set(key, { date: key, shops: 0, orders: 0, revenue: 0 });
  }

  // Fill Shops
  shops?.forEach((s) => {
    const key = new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (dateMap.has(key)) {
      const entry = dateMap.get(key);
      entry.shops += 1;
    }
  });

  // Fill Orders
  orders?.forEach((o) => {
    const key = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (dateMap.has(key)) {
      const entry = dateMap.get(key);
      entry.orders += 1;
      entry.revenue += o.total_amount;
    }
  });

  return {
    chartData: Array.from(dateMap.values()),
    totalShops: shops?.length || 0,
    totalOrders: orders?.length || 0,
  };
}