import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";

export async function OnboardingProgress() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: shop } = await supabase
    .from("shops")
    .select("id, logo_url, theme_config, delivery_note")
    .eq("owner_id", user.id)
    .single();

  if (!shop) return null;
  const { count: orderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", shop.id)
    .neq("status", "draft");

  const theme = shop.theme_config as any;
  const hasLogo = !!shop.logo_url || !!theme?.logoUrl;
  const hasInstructions =
    shop.delivery_note &&
    shop.delivery_note.length > 20 &&
    shop.delivery_note !== "Delivery charges calculated on WhatsApp";
  const hasFirstOrder = (orderCount || 0) > 0;

  const steps = [
    {
      id: "setup",
      label: "Shop Created",
      isCompleted: true,
      action: null,
    },
    {
      id: "branding",
      label: "Add Shop Logo",
      sub: "Make your store look professional.",
      isCompleted: hasLogo,
      action: { label: "Upload Logo", href: "/settings/appearance" },
    },
    {
      id: "instructions",
      label: "Set Payment Instructions",
      sub: "Tell customers how to pay (e.g. 'GPay on 98...')",
      isCompleted: hasInstructions,
      action: { label: "Update Settings", href: "/settings" },
    },
    {
      id: "first_order",
      label: "Get Your First Order",
      sub: "Share your link to start selling.",
      isCompleted: hasFirstOrder,
      action: { label: "Share Shop", href: "/marketing/share" },
    },
  ];

  const completedSteps = steps.filter((s) => s.isCompleted).length;
  const progress = (completedSteps / steps.length) * 100;

  if (progress === 100) {
    return null;
  }

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            🚀 Setup Progress
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({completedSteps}/{steps.length})
            </span>
          </CardTitle>
          <span className="text-sm font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-primary/20" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-start justify-between group"
            >
              <div className="flex items-start gap-3">
                {step.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${step.isCompleted ? "text-muted-foreground line-through opacity-50" : "text-foreground"}`}
                  >
                    {step.label}
                  </p>
                  {step.sub && !step.isCompleted && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.sub}
                    </p>
                  )}
                </div>
              </div>

              {!step.isCompleted && step.action && (
                <Link href={step.action.href}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    {step.action.label} <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
