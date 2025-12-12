// src/app/(dashboard)/dashboard/page.tsx
/*
 * Dashboard Home Page
 * This component serves as the main dashboard home for BizoraPro users.
 * It displays key metrics, charts, and quick actions to manage the shop.
 */
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { StatsCards } from "@/src/components/dashboard/widgets/stats-cards";
import { RevenueChart } from "@/src/components/dashboard/widgets/revenue-chart";
import { OrdersWidget } from "@/src/components/dashboard/widgets/orders-widget";
import { InsightsWidget } from "@/src/components/dashboard/widgets/insights-widget";
import { QuickActions } from "@/src/components/dashboard/widgets/quick-actions";
import {
  StatsSkeleton,
  ChartSkeleton,
  ListSkeleton,
} from "@/src/components/dashboard/widgets/skeletons";
import { Megaphone } from "lucide-react";
import { LowStockWidget } from "@/src/components/dashboard/widgets/low-stock-widget";
import { OnboardingProgress } from "@/src/components/dashboard/widgets/onboarding-progress";

export default async function DashboardHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("id, is_open, slug, plan, auto_close")
    .eq("owner_id", user.id)
    .single();
  if (!shop) redirect("/onboarding");

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("global_banner")
    .single();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-sm">
          <div
            className={`w-2.5 h-2.5 rounded-full ${shop.is_open ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          />
          <span className="text-sm font-medium">
            {shop.is_open ? "Live" : "Closed"}
          </span>
        </div>
      </div>

      {settings?.global_banner && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 animate-in fade-in">
          <Megaphone className="h-5 w-5 text-blue-500 shrink-0" />
          <p className="text-sm text-muted-foreground">
            {settings.global_banner}
          </p>
        </div>
      )}

      <Suspense
        fallback={
          <div className="h-40 bg-secondary/10 rounded-xl animate-pulse mb-8" />
        }
      >
        <OnboardingProgress />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards shopId={shop.id} />
      </Suspense>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart shopId={shop.id} />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <Suspense
            fallback={
              <div className="h-[300px] bg-card border border-border/50 rounded-xl animate-pulse" />
            }
          >
            <LowStockWidget shopId={shop.id} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<ListSkeleton />}>
        <OrdersWidget shopId={shop.id} />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-32 bg-secondary/10 rounded-xl animate-pulse" />
        }
      >
        <InsightsWidget shop={shop} />
      </Suspense>

      <QuickActions shop={shop} />
    </div>
  );
}
