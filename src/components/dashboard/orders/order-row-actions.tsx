// src/components/dashboard/orders/order-row-actions.tsx
/*  * Order Row Actions Component
 * This component provides a dropdown
 * menu for updating the status of
 * an order directly from the orders
 * dashboard.
 */
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatusAction } from "@/src/actions/order-actions";
import {
  MoreHorizontal,
  CheckCircle2,
  Truck,
  Package,
  Ban,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function OrderRowActions({ order }: { order: any }) {
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "shipped":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const handleUpdate = async (status: string) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("orderId", order.id);
      formData.append("status", status);

      const res = (await updateOrderStatusAction(formData)) as any;

      if (res?.error) {
        toast.error(String(res.error));
      } else if (res?.success) {
        toast.success(String(res.success));
      } else if (typeof res === "string") {
        toast.success(res);
      } else {
        toast.success("Order status updated");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <Badge
        variant="outline"
        className={`capitalize ${getStatusColor(order.status)}`}
      >
        {order.status}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            aria-label="Order actions"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleUpdate("confirmed")}
            disabled={loading}
          >
            <CheckCircle2 className="h-4 w-4 mr-2 text-blue-500" /> Confirm
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUpdate("shipped")}
            disabled={loading}
          >
            <Package className="h-4 w-4 mr-2 text-purple-500" /> Mark Shipped
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUpdate("delivered")}
            disabled={loading}
          >
            <Truck className="h-4 w-4 mr-2 text-green-500" /> Mark Delivered
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleUpdate("cancelled")}
            className="text-red-500 focus:text-red-500"
            disabled={loading}
          >
            <Ban className="h-4 w-4 mr-2" /> Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
