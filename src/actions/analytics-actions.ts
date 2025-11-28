"use server";

import { createClient } from "@/src/lib/supabase/server";
import { headers } from "next/headers";

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

// 2. RECORD VIEW (Server Action)
export async function trackEventAction(shopId: string, event: string, metadata: any = {}) {
  const supabase = await createClient();
  
  // Get simple fingerprint (User Agent + IP prefix) for basic unique counting
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "unknown";
  // In production, get IP from x-forwarded-for
  const hash = btoa(userAgent).slice(0, 20); 

  await supabase.from("analytics").insert({
    shop_id: shopId,
    event_type: event,
    metadata: metadata,
    viewer_hash: hash
  });
}

// 3. GET SINGLE PRODUCT STATS
export async function getProductStatsAction(productId: string) {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Get Views
  const { data: views } = await supabase
    .from("analytics")
    .select("created_at")
    .eq("event_type", "view_product")
    .contains("metadata", { productId }) // JSONB filter
    .gte("created_at", thirtyDaysAgo.toISOString());

  // 2. Get Orders (Sales)
  // We need to search inside the JSONB 'items' array in orders
  // This is tricky in simple SQL, so for MVP we fetch orders and filter in JS
  // (Or use Supabase .contains for array of objects if structure matches)
  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, items")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .neq("status", "draft"); // Only real orders

  // Filter orders that contain this product
  const productOrders = orders?.filter(o => 
    (o.items as any[]).some((i: any) => i.id === productId)
  ) || [];

  // 3. Group by Date
  const dateMap = new Map();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateMap.set(key, { date: key, views: 0, sales: 0 });
  }

  views?.forEach(v => {
    const key = new Date(v.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (dateMap.has(key)) dateMap.get(key).views += 1;
  });

  productOrders.forEach(o => {
    const key = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (dateMap.has(key)) dateMap.get(key).sales += 1;
  });

  return {
    chartData: Array.from(dateMap.values()),
    totalViews: views?.length || 0,
    totalSales: productOrders.length
  };
}

// 4. GET DEEP ANALYTICS
export async function getDeepAnalyticsAction() {
  const supabase = await createClient();

  // A. Plan Distribution (Pie Chart)
  // Count how many shops are on 'free' vs 'pro'
  const { data: shops } = await supabase.from("shops").select("plan");
  
  const planDistribution = [
    { name: "Free", value: 0, fill: "#94a3b8" }, // Gray
    { name: "Pro", value: 0, fill: "#E6B800" }, // Gold
  ];

  shops?.forEach(s => {
    if (s.plan === 'pro') planDistribution[1].value++;
    else planDistribution[0].value++;
  });

  // B. Top Shops (Leaderboard)
  // We need to count orders per shop. 
  // (Note: In a huge DB, we'd use an RPC function. For MVP, we fetch orders and aggregate in JS).
  const { data: orders } = await supabase
    .from("orders")
    .select("shop_id, total_amount")
    .neq("status", "draft");

  const shopStats = new Map();
  
  orders?.forEach(o => {
    if (!shopStats.has(o.shop_id)) {
      shopStats.set(o.shop_id, { revenue: 0, orders: 0 });
    }
    const stat = shopStats.get(o.shop_id);
    stat.revenue += o.total_amount;
    stat.orders += 1;
  });

  // Convert to array and get Shop Names (This part is heavy, so we limit to top 5 IDs first)
  const topShopIds = Array.from(shopStats.entries())
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(x => x[0]);

  const { data: topShopsDetails } = await supabase
    .from("shops")
    .select("id, name")
    .in("id", topShopIds);

  const leaderboard = topShopsDetails?.map(s => ({
    name: s.name,
    revenue: shopStats.get(s.id)?.revenue || 0,
    orders: shopStats.get(s.id)?.orders || 0,
  })).sort((a, b) => b.revenue - a.revenue) || [];

  return {
    planDistribution,
    leaderboard
  };
}