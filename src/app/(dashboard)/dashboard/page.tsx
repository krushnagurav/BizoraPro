import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, MousePointer2, Eye } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";

export default async function DashboardHome() {
  const supabase = await createClient();

  // 1. Get Current User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. CRITICAL: Check if User has a Shop
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  // 3. The Guard Clause: No Shop? Go to Onboarding.
  if (!shop) {
    redirect("/onboarding");
  }

  // 4. If Shop Exists, Show Dashboard
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full text-sm">
          <div className={`w-2 h-2 rounded-full ${shop.is_open ? 'bg-green-500' : 'bg-red-500'}`} />
          {shop.is_open ? "Store Open" : "Store Closed"}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Clicks</CardTitle>
            <MousePointer2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Potential Orders</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / {shop.product_limit}</div>
            <p className="text-xs text-muted-foreground">Free Plan Limit</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}