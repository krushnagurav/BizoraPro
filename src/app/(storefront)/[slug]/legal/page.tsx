// src/app/(storefront)/[slug]/legal/page.tsx
import type { CSSProperties } from "react";
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, RotateCcw, Lock, ShieldCheck } from "lucide-react";
import { hexToHsl } from "@/src/lib/utils";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";

export default async function ShopLegalPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("name, policies, theme_config")
    .eq("slug", slug)
    .single();

  if (!shop) return notFound();

  const policies = (shop.policies as any) || {
    privacy: "No privacy policy defined.",
    terms: "No terms of service defined.",
    refund: "No refund policy defined.",
  };

  const theme = (shop.theme_config as any) || {};
  const primaryColorHsl = hexToHsl(theme.primaryColor || "#E6B800");

  return (
    <div
      className="min-h-screen bg-[#F8F9FA]"
      style={{ "--primary": primaryColorHsl } as CSSProperties}
    >
      <ShopHeader shop={shop} />

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto text-primary">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Legal Information
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Transparency is key. Read our policies below to understand how we
            operate and protect your rights.
          </p>
        </div>

        {/* Policies Tabs */}
        <Tabs defaultValue="refund" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm h-auto">
            <TabsTrigger
              value="refund"
              className="py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold"
            >
              <RotateCcw className="w-4 h-4 mr-2 hidden sm:inline" /> Refund
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold"
            >
              <Lock className="w-4 h-4 mr-2 hidden sm:inline" /> Privacy
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold"
            >
              <ShieldCheck className="w-4 h-4 mr-2 hidden sm:inline" /> Terms
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="refund">
              <PolicyCard
                title="Return & Refund Policy"
                updated="Last updated: Recently"
                content={policies.refund}
                icon={RotateCcw}
              />
            </TabsContent>

            <TabsContent value="privacy">
              <PolicyCard
                title="Privacy Policy"
                updated="Your data is secure"
                content={policies.privacy}
                icon={Lock}
              />
            </TabsContent>

            <TabsContent value="terms">
              <PolicyCard
                title="Terms of Service"
                updated="Rules of usage"
                content={policies.terms}
                icon={ShieldCheck}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Note */}
        <div className="text-center pt-12 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            These policies are set by <strong>{shop.name}</strong>. BizoraPro is
            the platform provider and is not responsible for shop-specific
            operations.
          </p>
        </div>
      </div>

      <ShopFooter shop={shop} />
    </div>
  );
}

function PolicyCard({
  title,
  updated,
  content,
  icon: Icon,
}: {
  title: string;
  updated: string;
  content: string;
  icon: any;
}) {
  return (
    <Card className="bg-white border-0 shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden">
      <CardContent className="p-8 md:p-12">
        <div className="flex items-start justify-between mb-8 border-b border-slate-100 pb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
            <p className="text-sm text-slate-400">{updated}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl text-slate-900">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
          {content || "No policy text provided by the shop owner."}
        </div>
      </CardContent>
    </Card>
  );
}
