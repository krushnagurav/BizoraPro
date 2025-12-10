// src/components/dashboard/widgets/quick-actions.tsx
/*  * Quick Actions Component
 * This component provides quick action cards
 * for the dashboard, allowing users to easily
 * access common tasks like adding products,
 * sharing the store, adjusting settings, and
 * viewing the shop.
 */
import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MessageCircle, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";

export async function QuickActions({ shop }: { shop: any }) {
  const supabase = await createClient();
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shop.id)
    .is("deleted_at", null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(productCount || 0) < 5 ? (
          <Link href="/products/new">
            <ActionCard
              icon={Plus}
              title="Add Product"
              desc="Build your catalog"
              color="text-primary"
              bg="bg-primary/10"
              border="border-dashed border-2"
            />
          </Link>
        ) : (
          <Link href="/marketing/share">
            <ActionCard
              icon={MessageCircle}
              title="Share on WhatsApp"
              desc="Get more customers"
              color="text-purple-500"
              bg="bg-purple-500/10"
            />
          </Link>
        )}

        <Link href="/settings">
          <ActionCard
            icon={Settings}
            title="Shop Settings"
            desc="Logo, Hours, Policies"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
        </Link>

        <a href={`/${shop.slug}`} target="_blank">
          <ActionCard
            icon={ExternalLink}
            title="View Shop"
            desc="See customer view"
            color="text-green-500"
            bg="bg-green-500/10"
          />
        </a>
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  desc,
  color,
  bg,
  border = "border-border/50",
}: any) {
  return (
    <Card
      className={`hover:bg-secondary/10 transition-colors cursor-pointer shadow-sm h-full ${border}`}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${bg} ${color}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
