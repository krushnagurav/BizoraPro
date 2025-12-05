import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";

export default async function AdminPlansPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("price_monthly");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
        <Link href="/admin/plans/new">
          <Button className="bg-primary text-black hover:bg-primary/90 font-bold">
            <Plus className="h-4 w-4 mr-2" /> Create New Plan
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <Card
            key={plan.id}
            className="bg-[#111] border-white/10 text-white relative overflow-hidden"
          >
            {plan.is_popular && (
              <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
            )}
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <Badge
                    variant="outline"
                    className="mt-2 border-white/20 text-gray-400"
                  >
                    {plan.product_limit} Products
                  </Badge>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-white/10"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    ₹{plan.price_monthly}
                  </span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ₹{plan.price_yearly} /year
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
