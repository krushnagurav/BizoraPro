import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Zap,
  BarChart3,
  Plus,
  MessageCircle,
  Clock,
  TicketPercent,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export async function InsightsWidget({ shop }: { shop: any }) {
  const supabase = await createClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isoDate = sevenDaysAgo.toISOString();

  // Fetch Data for Logic
  const [views, clicks, productsCount, orders7d, revenue, randomProduct] =
    await Promise.all([
      supabase
        .from("analytics")
        .select("*", { count: "exact", head: true })
        .eq("shop_id", shop.id)
        .eq("event_type", "view_shop")
        .gte("created_at", isoDate),
      supabase
        .from("analytics")
        .select("*", { count: "exact", head: true })
        .eq("shop_id", shop.id)
        .eq("event_type", "click_whatsapp")
        .gte("created_at", isoDate),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("shop_id", shop.id)
        .is("deleted_at", null),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("shop_id", shop.id)
        .neq("status", "draft")
        .gte("created_at", isoDate),
      supabase
        .from("orders")
        .select("total_amount")
        .eq("shop_id", shop.id)
        .neq("status", "draft"),
      supabase
        .from("products")
        .select("id, name, image_url")
        .eq("shop_id", shop.id)
        .limit(1)
        .single(),
    ]);

  const viewCount = views.count || 0;
  const clickCount = clicks.count || 0;
  const orderCount = orders7d.count || 0;
  const productCount = productsCount.count || 0;
  const totalRevenue =
    revenue.data?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;
  const suggestedProduct = randomProduct.data;

  // Funnel Math
  const clickRate =
    viewCount > 0 ? Math.round((clickCount / viewCount) * 100) : 0;
  const conversionRate =
    clickCount > 0 ? Math.round((orderCount / clickCount) * 100) : 0;

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

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* 1. Optimization Tip */}
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
                <div className="h-12 w-12 bg-secondary rounded-md relative overflow-hidden border border-border">
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
                  className="w-full text-xs h-8"
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

      {/* 2. Smart Alert */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-primary">
            <Zap className="h-4 w-4" /> Recommended Action
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-bold text-sm">{smartTip.title}</h4>
            <p className="text-xs text-muted-foreground">{smartTip.text}</p>
            <Link href={smartTip.link}>
              <Button
                size="sm"
                className="w-full mt-2 font-bold gap-2 bg-primary text-black hover:bg-primary/90 h-8"
              >
                <smartTip.icon className="h-3 w-3" /> {smartTip.cta}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 3. Funnel */}
      <Card className="bg-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-blue-500" /> Funnel (7d)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Views</span>
              <span className="font-bold">{viewCount}</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Clicks</span>
              <span className="font-bold">
                {clickCount}{" "}
                <span className="text-[10px] text-green-500">
                  ({clickRate}%)
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${clickRate}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Orders</span>
              <span className="font-bold">
                {orderCount}{" "}
                <span className="text-[10px] text-yellow-500">
                  ({conversionRate}%)
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
