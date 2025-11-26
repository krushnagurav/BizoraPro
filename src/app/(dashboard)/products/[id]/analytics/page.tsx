import { createClient } from "@/src/lib/supabase/server";
import { getProductStatsAction } from "@/src/actions/analytics-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { AnalyticsChart } from "@/src/components/admin/analytics-chart"; // Reuse existing chart component
// Note: We might need to tweak AnalyticsChart to accept custom data keys or make a generic one.
// Let's create a specific ProductChart for this page to be safe.
import { ProductChart } from "@/src/components/dashboard/products/product-chart"; 

export default async function ProductAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Get Product Name
  const { data: product } = await supabase.from("products").select("name").eq("id", id).single();
  
  // Get Stats
  const stats = await getProductStatsAction(id);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Analytics</h1>
          <p className="text-muted-foreground">Performance for <span className="text-foreground font-bold">{product?.name}</span></p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-6 max-w-2xl">
        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views (30d)</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders (30d)</CardTitle>
            <ShoppingBag className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-card border-border/50">
        <CardHeader>
           <CardTitle>Views vs Sales</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
           <ProductChart data={stats.chartData} />
        </CardContent>
      </Card>
    </div>
  );
}