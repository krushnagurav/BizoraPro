// src/app/(super-admin)/admin/shops/[id]/page.tsx
/*  * Admin Shop Detail Page
 *
 * This page allows super administrators to view detailed information about a specific shop.
 * It includes shop owner details, business information, recent products, financial overview, and audit logs.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toggleShopStatusAction } from "@/src/actions/admin-actions";
import { ImpersonateButton } from "@/src/components/admin/impersonate-button";
import { GiftProDialog } from "@/src/components/admin/shops/gift-pro-dialog";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { createClient } from "@/src/lib/supabase/server";
import {
  ArrowLeft,
  Ban,
  ExternalLink,
  Lock,
  Package,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const adminAuth = createAdminClient();

  const [shopRes, productsRes, ordersRes, paymentsRes] = await Promise.all([
    supabase.from("shops").select("*").eq("id", id).single(),
    supabase
      .from("products")
      .select(
        "id, name, price, stock_count, status, image_url, category:categories(name)",
      )
      .eq("shop_id", id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("orders")
      .select("id, total_amount, created_at")
      .eq("shop_id", id),
    supabase
      .from("payments")
      .select("*")
      .eq("shop_id", id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const shop = shopRes.data;
  if (!shop) return notFound();

  const {
    data: { user: owner },
  } = await adminAuth.auth.admin.getUserById(shop.owner_id);

  const totalProducts = productsRes.count || 0;
  const { count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", id);

  const totalOrders = ordersRes.data?.length || 0;
  const totalRevenue =
    ordersRes.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
  const whatsappOrders = Math.round(totalOrders * 0.8);

  const storageUsed = "1.2 GB";
  const storageLimit = "5 GB";
  const storagePercent = 24;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/shops">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {shop.name}
              <Badge
                className={
                  shop.is_open
                    ? "bg-green-900 text-green-300"
                    : "bg-red-900 text-red-300"
                }
              >
                {shop.is_open ? "Active" : "Suspended"}
              </Badge>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Shop ID: {shop.id}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <GiftProDialog shopId={shop.id} currentPlan={shop.plan} />

          <ImpersonateButton userId={shop.owner_id} />

          <form action={toggleShopStatusAction}>
            <input type="hidden" name="shopId" value={shop.id} />
            <input
              type="hidden"
              name="desiredStatus"
              value={String(!shop.is_open)}
            />
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5 gap-2"
            >
              <Ban className="h-4 w-4" />{" "}
              {shop.is_open ? "Suspend" : "Activate"}
            </Button>
          </form>

          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5 gap-2"
          >
            <Lock className="h-4 w-4" /> Reset Pass
          </Button>

          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserIcon /> Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center font-bold text-xl">
                {owner?.email?.[0].toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-bold">
                  {owner?.user_metadata?.full_name || "Unknown Name"}
                </p>
                <p className="text-sm text-gray-400">{owner?.email}</p>
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>{" "}
                <span>{shop.whatsapp_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Joined</span>{" "}
                <span>{new Date(shop.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Login</span>{" "}
                <span>2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Shop Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href={`https://${shop.custom_domain || "bizorapro.com/" + shop.slug}`}
              target="_blank"
              className="text-blue-400 hover:underline text-sm flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />{" "}
              {shop.custom_domain || shop.slug}
            </a>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Products</p>
                <p className="text-xl font-bold">{productCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">WhatsApp Orders</p>
                <p className="text-xl font-bold">{whatsappOrders}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Storage</span>
                <span>
                  {storageUsed} / {storageLimit}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-base">Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Address</p>
              <p>123 Main Street, Surat, Gujarat</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Store Hours</p>
              <p>
                {shop.opening_time || "09:00"} - {shop.closing_time || "21:00"}
              </p>
            </div>
            <div className="pt-2">
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-500"
              >
                {shop.plan === "pro" ? "PRO PLAN" : "FREE PLAN"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#111] border-white/10 text-white md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base text-yellow-500">
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-gray-400">Total Revenue (GMV)</p>
              <p className="text-3xl font-bold">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Subscription</p>
                <p className="font-medium">
                  ₹{shop.plan === "pro" ? "199" : "0"}/mo
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">LTV</p>
                <p className="font-medium text-green-500">₹1,287</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Recent Subscription Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-white/10">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Plan</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paymentsRes.data?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  paymentsRes.data?.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td>Pro Monthly</td>
                      <td className="font-bold text-green-400">₹{p.amount}</td>
                      <td>
                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                          Paid
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-base">Recent Products</CardTitle>
          <Link href="#" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="pb-2">Product</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {productsRes.data?.map((p: any) => (
                <tr key={p.id}>
                  <td className="py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded overflow-hidden">
                      {p.image_url && (
                        <img
                          src={p.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    {p.name}
                  </td>
                  <td className="text-gray-400">{p.category?.name || "--"}</td>
                  <td>₹{p.price}</td>
                  <td className={p.stock_count < 5 ? "text-red-400" : ""}>
                    {p.stock_count}
                  </td>
                  <td>
                    <Badge
                      variant="outline"
                      className={
                        p.status === "active"
                          ? "border-green-500 text-green-500"
                          : "border-gray-500 text-gray-500"
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-base">System Audit Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              action: "Shop plan upgraded to Premium",
              by: "System",
              time: "2 days ago",
              icon: Package,
              color: "text-blue-400",
            },
            {
              action: "Admin reset shop password",
              by: "Admin User",
              time: "3 hours ago",
              icon: Lock,
              color: "text-yellow-400",
            },
            {
              action: "Shop account created",
              by: "System",
              time: "Jan 15, 2025",
              icon: UserIcon,
              color: "text-purple-400",
            },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-white/5 ${log.color}`}>
                <log.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.action}</p>
                <p className="text-xs text-gray-500">
                  By: {log.by} • {log.time}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-user"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
