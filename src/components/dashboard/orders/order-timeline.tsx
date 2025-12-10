// src/components/dashboard/orders/order-timeline.tsx
/*  * Order Timeline Component
 * This component visually represents
 * the progression of an order through
 * its various stages, providing users
 * with a clear timeline of the order's
 * status.
 */
import { CheckCircle2, Circle, Truck, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "placed", label: "Placed", icon: Circle },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { id: "shipped", label: "Shipped", icon: Package },
  { id: "delivered", label: "Delivered", icon: Truck },
];

export function OrderTimeline({ status }: { status: string }) {
  const currentIdx = STEPS.findIndex((s) => s.id === status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="text-red-500 font-bold border p-4 rounded-lg border-red-500/50 bg-red-500/10">
        Order Cancelled
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full max-w-xl mx-auto my-8 relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -z-10 rounded-full" />

      <div
        className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
        style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
      />

      {STEPS.map((step, i) => {
        const isActive = i <= currentIdx;
        const Icon = step.icon;

        return (
          <div
            key={step.id}
            className="flex flex-col items-center bg-background px-2"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                isActive
                  ? "bg-primary border-primary text-black"
                  : "bg-secondary border-secondary text-muted-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={cn(
                "text-xs mt-2 font-medium",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
