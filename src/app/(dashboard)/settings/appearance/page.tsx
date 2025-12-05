"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateShopAppearanceAction } from "@/src/actions/shop-actions";
import { ImageUpload } from "@/src/components/dashboard/image-upload";
import { createClient } from "@/src/lib/supabase/client";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AppearancePage() {
  const [loading, setLoading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [color, setColor] = useState("#E6B800");
  const [shopName, setShopName] = useState("");

  // 1. FETCH DATA
  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: shop } = await supabase
          .from("shops")
          .select("theme_config, name")
          .eq("owner_id", user.id)
          .single();

        if (shop) {
          setShopName(shop.name);
          const theme = (shop.theme_config as any) || {};
          if (theme.bannerUrl) setBannerUrl(theme.bannerUrl);
          if (theme.logoUrl) setLogoUrl(theme.logoUrl);
          if (theme.primaryColor) setColor(theme.primaryColor);
        }
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("bannerUrl", bannerUrl);
    formData.append("logoUrl", logoUrl);
    formData.append("primaryColor", color);

    const result = await updateShopAppearanceAction(formData);

    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Appearance updated!");
    }
  };

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          Appearance
        </h1>
        <p className="text-muted-foreground">
          Customize your shop&apos;s look.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BANNER */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Shop Banner</CardTitle>
            <CardDescription>
              Upload a cover image for your shop (1200x400px recommended).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border/50 rounded-xl p-8 bg-secondary/10 hover:bg-secondary/20 transition-colors">
              <ImageUpload value={bannerUrl} onChange={setBannerUrl} />
              {!bannerUrl && (
                <div className="mt-4 text-center pointer-events-none">
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground/50">
                    JPG, PNG (MAX. 5MB)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* LOGO */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Shop Logo</CardTitle>
            <CardDescription>
              Your brand icon (Square image recommended).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors relative overflow-hidden">
                <ImageUpload value={logoUrl} onChange={setLogoUrl} />
                {!logoUrl && (
                  <ImageIcon className="w-8 h-8 text-muted-foreground/50 pointer-events-none absolute" />
                )}
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-foreground">
                  {shopName || "Your Shop"}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  This logo will appear on your shop header, checkout page, and
                  WhatsApp messages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BRAND COLOR */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Brand Color</CardTitle>
            <CardDescription>
              Pick a main color for your buttons and highlights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl shadow-lg border border-white/10"
                style={{ backgroundColor: color }}
              />
              <div className="space-y-2">
                <Label>Color Picker</Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer opacity-0 absolute inset-0 z-10"
                    />
                    <div className="w-12 h-10 bg-secondary border border-border rounded flex items-center justify-center">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#E6B800"
                    className="font-mono uppercase w-32 bg-background border-border"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          <Button
            size="lg"
            className="font-bold bg-primary text-black hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Save Appearance"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
