// src/app/(storefront)/[slug]/contact/page.tsx
/* Shop Contact Page
 * This page provides contact information for a specific shop identified by its slug.
 * Users can find details such as phone number, social media links, and store hours.
 * The page layout and styling adapt based on the shop's theme configuration.
 */
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { createClient } from "@/src/lib/supabase/server";
import { hexToHsl } from "@/src/lib/utils";
import { Clock, Instagram, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ShopContactPage({
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
  const social = shop.social_links || ({} as any);

  return (
    <div
      className="min-h-screen bg-[#F8F9FA]"
      style={{ "--primary": primaryColorHsl } as CSSProperties}
    >
      <ShopHeader shop={shop} />

      <div className="max-w-md mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Contact the Shop
          </h1>
          <p className="text-slate-500">
            Get in touch with us for any questions
          </p>
        </div>

        <Card className="bg-white border-0 shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-8 text-center">
            <div className="relative w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
              {theme.logoUrl ? (
                <Image
                  src={theme.logoUrl}
                  fill
                  className="object-cover"
                  alt="Logo"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl font-bold text-slate-400">
                  {shop.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">{shop.name}</h2>
              <p className="text-sm text-slate-500">Shop Owner</p>
            </div>

            <a
              href={`https://wa.me/${shop.whatsapp_number}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full"
            >
              <Button className="w-full h-12 text-lg font-bold bg-primary text-white hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
                <MessageCircle className="w-5 h-5 mr-2" /> Message on WhatsApp
              </Button>
            </a>

            <div className="space-y-4 w-full text-left">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Phone</p>
                    <p className="text-sm text-slate-500">
                      +91 {shop.whatsapp_number}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${shop.whatsapp_number}`}
                  className="text-sm font-bold text-blue-600"
                >
                  Call
                </a>
              </div>

              {social.instagram && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Instagram</p>
                      <p className="text-sm text-slate-500">
                        @{String(social.instagram).split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-pink-600"
                  >
                    Follow
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50/50 rounded-3xl p-8 text-center space-y-2 border border-blue-100">
          <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Store Hours</h3>
          <p className="text-sm text-slate-500">
            {shop.opening_time
              ? `${shop.opening_time} - ${shop.closing_time}`
              : "9:00 AM - 9:00 PM"}
          </p>
        </div>
      </div>

      <ShopFooter shop={shop} />
    </div>
  );
}
