// src/app/(dashboard)/settings/page.tsx
/*  * Settings Page
 * This component renders the settings page for BizoraPro shop owners.
 * It allows users to update general settings such as store status,
 * order rules, store hours, social links, and SEO configurations.
 */
"use client";

import { useState, useEffect } from "react";
import { updateShopSettingsAction } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

function ProBadge() {
  return (
    <span className="ml-2 text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/50">
      PRO
    </span>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    const fetchShop = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("shops")
          .select("*")
          .eq("owner_id", user.id)
          .single();
        setShop(data);
      }
    };
    fetchShop();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await updateShopSettingsAction(formData);
    setLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Settings saved!");
  };

  if (!shop) return <div className="p-8">Loading settings...</div>;

  const isPro = shop.plan === "pro";

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-primary">General Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Store Status</CardTitle>
            <CardDescription>
              Turn off your store when you are on vacation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isOpen"
              defaultChecked={shop.is_open}
              className="h-5 w-5 accent-primary"
            />
            <span className="text-sm">Online (Accepting Orders)</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Order Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Minimum Order Value (₹)</Label>
              <Input
                name="minOrder"
                type="number"
                defaultValue={shop.min_order_value}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Delivery Note</Label>
              <Textarea
                name="deliveryNote"
                defaultValue={shop.delivery_note}
                placeholder="Delivery charges..."
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-card border-border/50 ${!isPro ? "opacity-70" : ""}`}
        >
          <CardHeader>
            <CardTitle>Store Hours {!isPro && <ProBadge />}</CardTitle>
            <CardDescription>
              Automatically close shop outside business hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="autoClose"
                defaultChecked={shop.auto_close}
                className="h-5 w-5 accent-primary"
                disabled={!isPro}
              />
              <Label>Enable Auto-Close Schedule</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Opening Time</Label>
                <Input
                  name="openingTime"
                  type="time"
                  defaultValue={shop.opening_time || "09:00"}
                  disabled={!isPro}
                />
              </div>
              <div className="space-y-2">
                <Label>Closing Time</Label>
                <Input
                  name="closingTime"
                  type="time"
                  defaultValue={shop.closing_time || "21:00"}
                  disabled={!isPro}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Social Links {!isPro && <ProBadge />}</CardTitle>
            <CardDescription>
              Connect your social media to build trust.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input
                name="instagram"
                defaultValue={shop.social_links?.instagram || ""}
                placeholder="https://instagram.com/..."
                disabled={!isPro}
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input
                name="facebook"
                defaultValue={shop.social_links?.facebook || ""}
                placeholder="https://facebook.com/..."
                disabled={!isPro}
              />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input
                name="youtube"
                defaultValue={shop.social_links?.youtube || ""}
                placeholder="https://youtube.com/..."
                disabled={!isPro}
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter / X URL</Label>
              <Input
                name="twitter"
                defaultValue={shop.social_links?.twitter || ""}
                placeholder="https://x.com/..."
                disabled={!isPro}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>SEO & Social Sharing</CardTitle>
            <CardDescription>
              Control how your shop looks on Google and WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input
                name="metaTitle"
                defaultValue={shop.seo_config?.metaTitle || shop.name}
                placeholder="Raj Fashion - Best Sarees in Surat"
              />
              <p className="text-[10px] text-muted-foreground">
                The bold text in Google/WhatsApp.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                name="metaDescription"
                defaultValue={shop.seo_config?.metaDescription || ""}
                placeholder="Buy premium cotton sarees at best prices..."
                rows={3}
              />
              <p className="text-[10px] text-muted-foreground">
                The small text description.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="font-bold" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Save General Settings"
          )}
        </Button>
      </form>
    </div>
  );
}
