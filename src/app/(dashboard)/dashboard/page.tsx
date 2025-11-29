import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { SalesChart } from "@/src/components/dashboard/sales-chart";
import { createClient } from "@/src/lib/supabase/server";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  IndianRupee,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Plus,
  Settings,
  ShoppingBag,
  Store,
  TicketPercent,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
  const supabase = await createClient();

  // 1. Auth & Shop Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!shop) redirect("/onboarding");

  // 2. Date Calculations
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isoDate7d = sevenDaysAgo.toISOString();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const isoDate30d = thirtyDaysAgo.toISOString();

  // 3. Parallel Data Fetching
  const [
    viewsData,
    clicksData,
    productsCountData,
    lowStockData,
    leadsData,
    platformSettings,
    recentOrders,
    revenueData,
    pendingOrders,
    chartOrders,
    orders7dData,
    randomProductData,
  ] = await Promise.all([
    supabase
      .from("analytics")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .eq("event_type", "view_shop")
      .gte("created_at", isoDate7d),
    supabase
      .from("analytics")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .eq("event_type", "click_whatsapp")
      .gte("created_at", isoDate7d),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .is("deleted_at", null),
    supabase
      .from("products")
      .select("id, name, stock_count, image_url")
      .eq("shop_id", shop.id)
      .lt("stock_count", 5)
      .is("deleted_at", null)
      .limit(3),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .gte("created_at", isoDate7d),
    supabase.from("platform_settings").select("global_banner").single(),
    supabase
      .from("orders")
      .select("*")
      .eq("shop_id", shop.id)
      .neq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("orders")
      .select("total_amount")
      .eq("shop_id", shop.id)
      .neq("status", "draft"),
    supabase
      .from("orders")
      .select("*")
      .eq("shop_id", shop.id)
      .eq("status", "placed")
      .order("created_at", { ascending: true })
      .limit(5),
    supabase
      .from("orders")
      .select("created_at, total_amount")
      .eq("shop_id", shop.id)
      .neq("status", "draft")
      .gte("created_at", isoDate30d),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .neq("status", "draft")
      .gte("created_at", isoDate7d),
    supabase
      .from("products")
      .select("id, name, image_url")
      .eq("shop_id", shop.id)
      .limit(1)
      .single(),
  ]);

  // 4. Process Data
  const viewCount = viewsData.count || 0;
  const clickCount = clicksData.count || 0;
  const orderCount7d = orders7dData.count || 0;
  const productCount = productsCountData.count || 0;
  const leadsCount = leadsData.count || 0;
  const pendingCount = pendingOrders.data?.length || 0;
  const totalRevenue =
    revenueData.data?.reduce(
      (acc, order) => acc + Number(order.total_amount),
      0
    ) || 0;
  const globalBanner = platformSettings.data?.global_banner;
  const suggestedProduct = randomProductData.data;

  const clickRate =
    viewCount > 0 ? Math.round((clickCount / viewCount) * 100) : 0;
  const conversionRate =
    clickCount > 0 ? Math.round((orderCount7d / clickCount) * 100) : 0;

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
  chartOrders.data?.forEach((order) => {
    const key = new Date(order.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (chartDataMap.has(key))
      chartDataMap.get(key).revenue += order.total_amount;
  });
  const chartDataArray = Array.from(chartDataMap.values());

  // 🧠 SMART TIPS LOGIC
  let smartTip = {
    title: "Add more products",
    text: "Stores with 5+ products get 3x more orders.",
    cta: "Add Product",
    link: "/products/new",
    icon: Plus,
  };

  if (productCount >= 5) {
    if (totalRevenue === 0) {
      smartTip = {
        title: "Get your first sale",
        text: "Share your shop link with 3 friends on WhatsApp.",
        cta: "Share Shop",
        link: "/marketing/share",
        icon: MessageCircle,
      };
    } else if (!shop.auto_close) {
      smartTip = {
        title: "Enable Auto-Close",
        text: "You might be missing orders at night. Set store hours.",
        cta: "Set Hours",
        link: "/settings",
        icon: Clock,
      };
    } else {
      smartTip = {
        title: "Boost Sales",
        text: "Create a discount coupon to reward loyal customers.",
        cta: "Create Coupon",
        link: "/coupons",
        icon: TicketPercent,
      };
    }
  }

  // Helper
  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr`;
    return `${Math.floor(hours / 24)} day`;
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER (Existing) */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Overview of performance</span>
            <span className="text-xs opacity-50">•</span>
            <span className="text-xs opacity-50">Updated just now</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-full shadow-sm">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              shop.is_open
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "bg-red-500"
            }`}
          />
          <span className="font-medium text-sm">
            {shop.is_open ? "Shop Live" : "Shop Closed"}
          </span>
        </div>
      </div>

      {/* 🔔 GLOBAL ALERT */}
      {globalBanner && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 items-start animate-in fade-in">
          <Megaphone className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-blue-500 text-sm">Update</h4>
            <p className="text-sm text-muted-foreground">{globalBanner}</p>
          </div>
        </div>
      )}

      {/* ✨ 1. CLICKABLE KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/orders">
          <Card className="bg-card border-border/50 shadow-sm hover:border-primary/50 transition cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <div className="text-2xl font-bold">
                  ₹{totalRevenue.toLocaleString()}
                </div>
              </div>
              <IndianRupee className="h-8 w-8 text-green-500 opacity-20" />
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${shop.slug}`} target="_blank">
          <Card className="bg-card border-border/50 shadow-sm hover:border-primary/50 transition cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Store Views (7d)
                </p>
                <div className="text-2xl font-bold">{viewCount}</div>
              </div>
              <Eye className="h-8 w-8 text-blue-500 opacity-20" />
            </CardContent>
          </Card>
        </Link>
        <Card className="bg-card border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                WhatsApp Clicks
              </p>
              <div className="text-2xl font-bold">{clickCount}</div>
            </div>
            <MessageCircle className="h-8 w-8 text-green-500 opacity-20" />
          </CardContent>
        </Card>
        <Link href="/products">
          <Card className="bg-card border-border/50 shadow-sm hover:border-primary/50 transition cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Products
                </p>
                <div className="text-2xl font-bold">{productCount}</div>
              </div>
              <Store className="h-8 w-8 text-purple-500 opacity-20" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ROW 2: TRENDS & LOW STOCK */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={chartDataArray} />
        </div>
        <Card className="bg-card border-border/50 lg:col-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" /> Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {lowStockData.data?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm bg-secondary/10 rounded-lg h-full flex flex-col items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2 opacity-50" />
                Inventory Healthy
              </div>
            ) : (
              lowStockData.data?.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b border-border/50 last:border-0 pb-2 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded flex items-center justify-center text-[10px] relative overflow-hidden">
                      {p.image_url && (
                        <Image
                          src={p.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[100px]">
                        {p.name}
                      </p>
                      <p className="text-xs text-red-400 font-bold">
                        {p.stock_count} left
                      </p>
                    </div>
                  </div>
                  <Link href={`/products/${p.id}`}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      Restock
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: PENDING ORDERS & RECENT ACTIVITY */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 🔴 1. PENDING WHATSAPP (High Priority) */}
        <Card className="bg-card border-border/50 border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" /> Pending Actions
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Orders placed but not confirmed on WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {pendingOrders.data?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      You are all caught up! 🎉
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingOrders.data?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">
                          {order.customer_info.name}
                        </div>
                        <div className="text-xs text-red-400 font-bold">
                          {getTimeAgo(order.created_at)} ago
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        ₹{order.total_amount}
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`https://wa.me/${order.customer_info.phone}`}
                          target="_blank"
                        >
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white gap-1"
                          >
                            <MessageCircle className="h-3 w-3" /> Chat
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* RECENT ORDERS */}
        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" /> Recent Orders
            </CardTitle>
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {recentOrders.data?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No orders yet.
                      <Link
                        href="/marketing/share"
                        className="text-primary ml-1 hover:underline"
                      >
                        Share your shop link!
                      </Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.data?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.customer_info.name}
                      </TableCell>
                      <TableCell>₹{order.total_amount}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="capitalize">
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ROW 4: INSIGHTS & GROWTH */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* ⭐ 1. PRODUCT INSIGHTS (New) */}
        <Card className="bg-gradient-to-br from-card to-secondary/10 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-yellow-500" /> Optimization Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suggestedProduct ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-secondary rounded-md relative overflow-hidden">
                    {suggestedProduct.image_url && (
                      <Image
                        src={suggestedProduct.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm line-clamp-1">
                      {suggestedProduct.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Getting views, needs sales.
                    </p>
                  </div>
                </div>
                <Link href={`/products/${suggestedProduct.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                  >
                    Improve Description
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-2">
                Add products to get AI insights.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 💡 2. SMART ALERTS (New) */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <Zap className="h-4 w-4" /> Recommended Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-bold">{smartTip.title}</h4>
              <p className="text-xs text-muted-foreground">{smartTip.text}</p>
              <Link href={smartTip.link}>
                <Button
                  size="sm"
                  className="w-full mt-2 font-bold gap-2 bg-primary text-black hover:bg-primary/90"
                >
                  <smartTip.icon className="h-3 w-3" /> {smartTip.cta}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 📊 3. CONVERSION FUNNEL (New) */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-blue-500" /> Funnel (7d)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Views</span>
              <span className="font-bold">{viewCount}</span>
            </div>
            <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500"
                style={{ width: "100%" }}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Clicks</span>
              <span className="font-bold">
                {clickCount}{" "}
                <span className="text-[10px] text-green-500">
                  ({clickRate}%)
                </span>
              </span>
            </div>
            <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-500"
                style={{ width: `${clickRate}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Orders</span>
              <span className="font-bold">
                {orderCount7d}{" "}
                <span className="text-[10px] text-yellow-500">
                  ({conversionRate}%)
                </span>
              </span>
            </div>
            <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-yellow-500"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 5: QUICK ACTIONS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* If few products -> Focus on Adding */}
          {productCount < 5 ? (
            <Link href="/products/new">
              <Card className="hover:bg-secondary/10 transition-colors cursor-pointer border-dashed border-2 border-border/50 shadow-none h-full">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold">Add Product</h3>
                  <p className="text-xs text-muted-foreground">
                    Build your catalog
                  </p>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Link href="/marketing/share">
              <Card className="hover:bg-secondary/10 transition-colors cursor-pointer border-border/50 shadow-sm h-full">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold">Share on WhatsApp</h3>
                  <p className="text-xs text-muted-foreground">
                    Get more customers
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}

          <Link href="/settings">
            <Card className="hover:bg-secondary/10 transition-colors cursor-pointer border-border/50 shadow-sm h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="font-bold">Shop Settings</h3>
              </CardContent>
            </Card>
          </Link>
          <a href={`/${shop.slug}`} target="_blank">
            <Card className="hover:bg-secondary/10 transition-colors cursor-pointer border-border/50 shadow-sm h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <h3 className="font-bold">View Shop</h3>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}