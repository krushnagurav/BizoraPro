// src/app/(storefront)/[slug]/about/page.tsx
/* Shop About Page
 * This page provides information about a specific shop identified by its slug.
 * It includes the shop's story, values, and unique selling points.
 * The page layout and styling adapt based on the shop's theme configuration.
 */
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { createClient } from "@/src/lib/supabase/server";
import { hexToHsl } from "@/src/lib/utils";
import { Heart, Hexagon, MessageCircle, Truck } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ShopAboutPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!shop) return notFound();

  const theme = (shop.theme_config as any) || {};
  const primaryColorHsl = hexToHsl(theme.primaryColor || "#E6B800");

  return (
    <div
      className="min-h-screen bg-[#F8F9FA] pb-24"
      style={{ "--primary": primaryColorHsl } as CSSProperties}
    >
      <ShopHeader shop={shop} />

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">
        <div className="text-center space-y-6">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            Our Story
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900">
            About Our Shop
          </h2>
          <p className="text-slate-500 leading-relaxed max-w-xl mx-auto">
            Where timeless elegance meets contemporary craftsmanship. We are
            dedicated to bringing you the finest products with a personal touch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-slate-900">
              Crafting Excellence Since the Beginning
            </h3>
            <div className="w-12 h-1 bg-primary/50" />
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                Our journey began with a simple vision: to bring exceptional
                quality and timeless design to those who appreciate the finer
                things in life. Every piece in our collection tells a story.
              </p>
              <p>
                We believe that luxury is not just about price—it&apos;s about
                the experience, the craftsmanship, and the connection between
                what you own and who you are.
              </p>
            </div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-2 border-4 border-white">
            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
              Shop Interior Image
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Why Choose Us
            </span>
            <h3 className="text-3xl font-serif text-slate-900">
              Our Promise to You
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Truck,
                title: "Fast Delivery",
                text: "Your time is precious. We ensure swift processing and reliable shipping.",
              },
              {
                icon: Hexagon,
                title: "Handpicked Quality",
                text: "Every item is personally selected and inspected for perfection.",
              },
              {
                icon: Heart,
                title: "Local Brand",
                text: "Proudly rooted in our community. Supporting us means supporting local craft.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                <CardContent className="p-8 space-y-4 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-primary text-white rounded-3xl p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white/80" />
            <h3 className="text-3xl font-serif">Let&apos;s Connect</h3>
            <p className="text-white/90 max-w-md mx-auto">
              Have questions? Want to learn more about our products? We&apos;re
              here to help. Reach out via WhatsApp for personalized assistance.
            </p>
            <a
              href={`https://wa.me/${shop.whatsapp_number}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="mt-8 bg-white text-primary hover:bg-slate-100 font-bold h-12 px-8 rounded-full">
                Chat with us on WhatsApp
              </Button>
            </a>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>

      <ShopFooter shop={shop} />
    </div>
  );
}
