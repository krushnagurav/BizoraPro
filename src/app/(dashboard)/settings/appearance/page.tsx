"use client";

import { useState, useEffect } from "react";
import { updateShopAppearanceAction } from "@/src/actions/shop-actions";
import { ImageUpload } from "@/src/components/dashboard/image-upload";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function AppearancePage() {
  const [loading, setLoading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [color, setColor] = useState("#E6B800");

  // 1. FETCH EXISTING SETTINGS ON LOAD
  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: shop } = await supabase
          .from("shops")
          .select("theme_config")
          .eq("owner_id", user.id)
          .single();

        if (shop?.theme_config) {
          const theme = shop.theme_config as any;
          if (theme.bannerUrl) setBannerUrl(theme.bannerUrl);
          if (theme.logoUrl) setLogoUrl(theme.logoUrl); // ✅ FIX: Fetch Logo
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
    formData.append("logoUrl", logoUrl); // ✅ FIX: Send Logo
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
    <div className="p-8 max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-primary">Appearance</h1>
      <p className="text-muted-foreground">Customize your shop&apos;s look.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Banner Image */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Shop Banner</CardTitle>
            <CardDescription>
              Upload a cover image for your shop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload value={bannerUrl} onChange={setBannerUrl} />
          </CardContent>
        </Card>

        {/* NEW: Logo Section */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Shop Logo</CardTitle>
            <CardDescription>
              Your brand icon (Square image recommended).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <ImageUpload value={logoUrl} onChange={setLogoUrl} />
            </div>
          </CardContent>
        </Card>

        {/* Brand Color */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Brand Color</CardTitle>
            <CardDescription>
              Pick a main color for your buttons.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg border border-border shadow-sm transition-colors"
              style={{ backgroundColor: color }}
            />
            <div className="space-y-2 flex-1">
              <Label>Color Picker</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#E6B800"
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="font-bold" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Save Appearance"
          )}
        </Button>
      </form>
    </div>
  );
}