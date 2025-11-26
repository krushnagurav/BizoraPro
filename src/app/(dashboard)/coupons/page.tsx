import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, TicketPercent } from "lucide-react";
import { deleteCouponAction } from "@/src/actions/coupon-actions";
import { AddCouponDialog } from "@/src/components/dashboard/coupons/add-coupon-dialog";
import { redirect } from "next/navigation";

export default async function CouponsPage() {
  const supabase = await createClient();
  
  // 1. SECURITY CHECK: Get User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login"); // Kick out if not logged in
  }

  // 2. SECURITY CHECK: Get Shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  // If user is logged in but has no shop (e.g. Admin accessing wrong page, or incomplete signup)
  if (!shop) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">No Shop Found</h1>
        <p className="text-muted-foreground">You need to create a shop to manage coupons.</p>
        <Button asChild className="mt-4"><a href="/onboarding">Create Shop</a></Button>
      </div>
    );
  }

  // 3. Safe to fetch coupons now
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
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No active coupons. Create one!
                  </TableCell>
                </TableRow>
              ) : (
                coupons?.map((coupon) => (
                  <TableRow key={coupon.id} className="border-border hover:bg-secondary/10">
                    <TableCell className="font-mono font-bold text-primary">
                      {coupon.code}
                    </TableCell>
                    <TableCell>
                      {coupon.discount_type === 'percent' ? `${coupon.discount_value}% Off` : `₹${coupon.discount_value} Off`}
                    </TableCell>
                    <TableCell>
                      {coupon.min_order_value > 0 ? `₹${coupon.min_order_value}` : 'None'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{coupon.used_count} used</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={deleteCouponAction}>
                        <input type="hidden" name="id" value={coupon.id} />
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-100/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}