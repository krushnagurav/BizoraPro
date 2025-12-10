// src/components/dashboard/billing/plan-manager.tsx
/*  * Plan Manager Component
 * This component allows users to
 * view their current subscription
 * plan and upgrade to a Pro plan
 * directly from the dashboard.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Zap, Loader2 } from "lucide-react";
import {
  createSubscriptionOrderAction,
  verifyPaymentAction,
} from "@/src/actions/billing-actions";
import { toast } from "sonner";
import Script from "next/script";
import { useRouter } from "next/navigation";

export function PlanManager({
  currentPlan,
  productCount,
  productLimit,
}: {
  currentPlan: string;
  productCount: number;
  productLimit: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async (planType: "monthly" | "yearly") => {
    setLoading(true);
    const orderData = await createSubscriptionOrderAction(planType);

    if (orderData?.error) {
      toast.error(orderData.error);
      setLoading(false);
      return;
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "BizoraPro",
      description: `Upgrade to Pro (${planType})`,
      order_id: orderData.orderId,
      handler: async function (response: any) {
        const verify = await verifyPaymentAction(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          planType,
        );
        if (verify?.success) {
          toast.success("Welcome to Pro! 🚀");
          router.refresh();
        } else {
          toast.error("Payment verification failed");
        }
        setLoading(false);
      },
      theme: { color: "#E6B800" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Card className="bg-card border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Current Plan</h3>
          <div className="text-3xl font-bold mb-2 capitalize">
            {currentPlan} Plan
          </div>

          <div className="p-4 bg-secondary/20 rounded-lg border border-border/50 mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Product Usage</span>
              <span className="font-bold">
                {productCount} / {productLimit}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${productCount >= productLimit ? "bg-red-500" : "bg-green-500"}`}
                style={{
                  width: `${Math.min(100, (productCount / productLimit) * 100)}%`,
                }}
              />
            </div>
            {productCount >= productLimit && (
              <p className="text-xs text-red-400 mt-2">
                Limit Reached. Upgrade to add more.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-primary shadow-lg shadow-primary/10 relative overflow-hidden">
        {currentPlan === "free" && (
          <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
        )}
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Pro Business</h3>
              <p className="text-sm text-muted-foreground">
                Unlock full potential
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-sm mb-8">
            {[
              "Unlimited Products",
              "Priority Support",
              "Remove Branding",
              "Revenue Analytics",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> {f}
              </li>
            ))}
          </ul>

          {currentPlan === "free" ? (
            <div className="flex gap-4">
              <Button
                onClick={() => handleUpgrade("monthly")}
                className="flex-1 font-bold bg-white text-black hover:bg-gray-200"
                disabled={loading}
              >
                ₹199 / mo
              </Button>
              <Button
                onClick={() => handleUpgrade("yearly")}
                className="flex-1 font-bold"
                disabled={loading}
              >
                ₹1999 / yr
              </Button>
            </div>
          ) : (
            <Button
              disabled
              className="w-full bg-green-500/10 text-green-500 border border-green-500/20"
            >
              Active Plan
            </Button>
          )}

          {loading && (
            <div className="text-center mt-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin inline h-3 w-3 mr-2" />
              Processing securely...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
