import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ImpersonateButton } from "@/src/components/admin/impersonate-button";

export default async function AdminShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Shop & Owner Email
  // Note: To get email, we might need to join auth.users which is hard in standard SQL.
  // For MVP, we just use the ID for impersonation.
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("id", id)
    .single();

  if (!shop) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold text-white">{shop.name}</h1>
            <div className="flex items-center gap-2 text-gray-400 mt-1">
              <span>ID: {shop.id}</span>
              <Badge variant="outline" className="border-primary text-primary">
                {shop.plan}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL}/${shop.slug}`}
            target="_blank"
          >
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 gap-2"
            >
              <ExternalLink className="h-4 w-4" /> Visit Shop
            </Button>
          </a>

          {/* THE MAGIC BUTTON */}
          <ImpersonateButton userId={shop.owner_id} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">WhatsApp</span>
              <span>{shop.whatsapp_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span
                className={shop.is_open ? "text-green-400" : "text-red-400"}
              >
                {shop.is_open ? "Open" : "Closed"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Product Limit</span>
              <span>{shop.product_limit}</span>
            </div>
          </CardContent>
        </Card>

        {/* Add more stats cards here if needed */}
      </div>
    </div>
  );
}
