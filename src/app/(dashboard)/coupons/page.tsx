// src/app/(dashboard)/coupons/page.tsx
/*
 * Coupons Management Page
 * This component allows users to manage discount coupons for their BizoraPro shop.
 * Users can create, view, duplicate, and delete coupons to offer promotions
 * to their customers.
 */
import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Calendar } from "lucide-react";
import {
  deleteCouponAction,
  duplicateCouponAction,
} from "@/src/actions/coupon-actions";
import { AddCouponDialog } from "@/src/components/dashboard/coupons/add-coupon-dialog";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CouponShareButton } from "@/src/components/dashboard/coupons/coupon-share-button";
import { CouponForm } from "@/src/components/dashboard/coupons/coupon-form";

export default async function CouponsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">No Shop Found</h1>
        <p className="text-muted-foreground">
          You need to create a shop to manage coupons.
        </p>
        <Button asChild className="mt-4">
          <Link href="/onboarding">Create Shop</Link>
        </Button>
      </div>
    );
  }

  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Coupons</h1>
          <p className="text-muted-foreground">Manage discounts and offers.</p>
        </div>
        <AddCouponDialog />
      </div>

      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No active coupons. Create one!
                  </TableCell>
                </TableRow>
              ) : (
                coupons?.map((coupon) => {
                  const isExpired =
                    coupon.end_date && new Date(coupon.end_date) < new Date();
                  const isActive = coupon.is_active && !isExpired;

                  return (
                    <TableRow
                      key={coupon.id}
                      className="border-border hover:bg-secondary/10"
                    >
                      <TableCell className="font-mono font-bold text-primary">
                        {coupon.code}
                      </TableCell>

                      <TableCell>
                        {coupon.discount_type === "percent"
                          ? `${coupon.discount_value}% Off`
                          : `₹${coupon.discount_value} Off`}
                      </TableCell>

                      <TableCell>
                        {coupon.min_order_value > 0
                          ? `₹${coupon.min_order_value}`
                          : "None"}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {coupon.end_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(coupon.end_date).toLocaleDateString()}
                          </div>
                        ) : (
                          "No Expiry"
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {coupon.used_count} used
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {isActive ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="opacity-50">
                            Expired
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <CouponShareButton code={coupon.code} />

                          <CouponForm initialData={coupon} />

                          <form action={duplicateCouponAction}>
                            <input type="hidden" name="id" value={coupon.id} />
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </form>

                          <form action={deleteCouponAction}>
                            <input type="hidden" name="id" value={coupon.id} />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
