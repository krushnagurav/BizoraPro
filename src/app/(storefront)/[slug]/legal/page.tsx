import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ShopLegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("name, policies, theme_config")
    .eq("slug", slug)
    .single();

  if (!shop) return notFound();
  const policies = shop.policies as any || {};
  const theme = shop.theme_config as any || {};

  return (
    <div 
      className="max-w-md mx-auto bg-background min-h-screen border-x border-border/30 p-4 space-y-6"
      style={{ "--primary": theme.primaryColor || "#E6B800" } as React.CSSProperties}
    >
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/${slug}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-6 w-6" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Store Policies</h1>
      </div>

      <div className="space-y-6">
        <PolicyCard title="Refund Policy" content={policies.refund} />
        <PolicyCard title="Terms of Service" content={policies.terms} />
        <PolicyCard title="Privacy Policy" content={policies.privacy} />
      </div>
    </div>
  );
}

function PolicyCard({ title, content }: { title: string, content: string }) {
  if (!content) return null;
  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
}