// src/actions/analytics-actions.ts
/**
 * Analytics Actions.
 *
 * This file contains server-side actions for tracking and retrieving
 * analytics data related to shops and products.
 */
"use server";

import { createClient } from "@/src/lib/supabase/server";
import { headers } from "next/headers";

export async function getGrowthStatsAction() {
  const supabase = await createClient();

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

  const dateMap = new Map();

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dateMap.set(key, { date: key, shops: 0, orders: 0, revenue: 0 });
  }

  shops?.forEach((s) => {
    const key = new Date(s.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (dateMap.has(key)) {
      const entry = dateMap.get(key);
      entry.shops += 1;
    }
  });

  orders?.forEach((o) => {
    const key = new Date(o.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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

export async function trackEventAction(
  shopId: string,
  event: string,
  metadata: any = {},
) {
  const supabase = await createClient();

  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "unknown";

  const hash = btoa(userAgent).slice(0, 20);

  await supabase.from("analytics").insert({
    shop_id: shopId,
    event_type: event,
    metadata: metadata,
    viewer_hash: hash,
  });
}

export async function getProductStatsAction(productId: string) {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: views } = await supabase
    .from("analytics")
    .select("created_at")
    .eq("event_type", "view_product")
    .contains("metadata", { productId })
    .gte("created_at", thirtyDaysAgo.toISOString());

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, items")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .neq("status", "draft");

  const productOrders =
    orders?.filter((o) =>
      (o.items as any[]).some((i: any) => i.id === productId),
    ) || [];

  const dateMap = new Map();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dateMap.set(key, { date: key, views: 0, sales: 0 });
  }

  views?.forEach((v) => {
    const key = new Date(v.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (dateMap.has(key)) dateMap.get(key).views += 1;
  });

  productOrders.forEach((o) => {
    const key = new Date(o.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (dateMap.has(key)) dateMap.get(key).sales += 1;
  });

  return {
    chartData: Array.from(dateMap.values()),
    totalViews: views?.length || 0,
    totalSales: productOrders.length,
  };
}

export async function getDeepAnalyticsAction() {
  const supabase = await createClient();

  const { data: shops } = await supabase
    .from("shops")
    .select("plan, created_at");

  const planDistribution = [
    { name: "Free", value: 0, fill: "#94a3b8" },
    { name: "Pro", value: 0, fill: "#E6B800" },
  ];

  const growthMap = new Map();
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = d.toLocaleString("default", { month: "short" });
    growthMap.set(key, { name: key, shops: 0 });
  }

  shops?.forEach((s) => {
    if (s.plan === "pro") planDistribution[1].value++;
    else planDistribution[0].value++;

    const key = new Date(s.created_at).toLocaleString("default", {
      month: "short",
    });
    if (growthMap.has(key)) {
      growthMap.get(key).shops += 1;
    }
  });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .neq("status", "draft")
    .neq("status", "cancelled")
    .gte("created_at", sixMonthsAgo.toISOString());

  const revenueMap = new Map();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = d.toLocaleString("default", { month: "short" });
    revenueMap.set(key, { name: key, revenue: 0 });
  }

  orders?.forEach((o) => {
    const key = new Date(o.created_at).toLocaleString("default", {
      month: "short",
    });
    if (revenueMap.has(key)) {
      revenueMap.get(key).revenue += o.total_amount;
    }
  });

  const { data: leaderboard } = await supabase.rpc("get_top_shops_analytics", {
    limit_count: 5,
  });

  return {
    planDistribution,
    growthData: Array.from(growthMap.values()),
    revenueData: Array.from(revenueMap.values()),
    leaderboard: leaderboard || [],
  };
}
