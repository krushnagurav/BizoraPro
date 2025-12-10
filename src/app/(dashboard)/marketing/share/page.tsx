// src/app/(dashboard)/marketing/share/page.tsx
/*
 * Share Store Page
 * This component allows users to share their BizoraPro shop link
 * and QR code across various platforms like WhatsApp, Instagram,
 * and Facebook. It also provides analytics on link views and clicks.
 */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/src/lib/supabase/client";
import {
  ArrowRight,
  Copy,
  Download,
  ExternalLink,
  Facebook,
  Instagram,
  Lightbulb,
  Loader2,
  MessageCircle,
  Printer,
  Share2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Shop {
  id: string;
  slug: string;
  name: string;
  owner_id: string;
}

export default function ShareStorePage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopUrl, setShopUrl] = useState("");
  const [qrFormat, setQrFormat] = useState("png");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ views: 0, clicks: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: shopData } = await supabase
          .from("shops")
          .select("*")
          .eq("owner_id", user.id)
          .single();

        if (shopData) {
          setShop(shopData);
          if (typeof window !== "undefined") {
            const baseUrl = window.location.origin;
            setShopUrl(`${baseUrl}/${shopData.slug}`);
          }

          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const isoDate = sevenDaysAgo.toISOString();

          const [viewsResult, clicksResult] = await Promise.all([
            supabase
              .from("analytics")
              .select("*", { count: "exact", head: true })
              .eq("shop_id", shopData.id)
              .eq("event_type", "view_shop")
              .gte("created_at", isoDate),
            supabase
              .from("analytics")
              .select("*", { count: "exact", head: true })
              .eq("shop_id", shopData.id)
              .eq("event_type", "click_whatsapp")
              .gte("created_at", isoDate),
          ]);

          setStats({
            views: viewsResult.count || 0,
            clicks: clicksResult.count || 0,
          });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(shopUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("shop-qr");
    if (!svg || !shop) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.getContext("2d");
    const img = new Image();

    const width = qrFormat === "story" ? 1080 : 1200;
    const height = qrFormat === "story" ? 1920 : 1400;

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = qrFormat === "story" ? "#000000" : "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      const qrSize = qrFormat === "story" ? 600 : 800;
      const x = (width - qrSize) / 2;
      const y = (height - qrSize) / 2 - 100;
      ctx.drawImage(img, x, y, qrSize, qrSize);

      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = qrFormat === "story" ? "#888888" : "#555555";
      ctx.textAlign = "center";
      ctx.fillText(`Scan to visit ${shop.name}`, width / 2, y + qrSize + 60);

      ctx.font = "20px sans-serif";
      ctx.fillStyle = qrFormat === "story" ? "#444444" : "#AAAAAA";
      ctx.fillText("Powered by BizoraPro", width / 2, height - 50);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${shop.slug}-qrcode-${qrFormat}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success(`QR Code (${qrFormat}) downloaded!`);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = (platform: string) => {
    const text = `Check out my online shop! Order here: ${shopUrl}?src=${platform}`;
    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shopUrl,
        )}`;
        break;
      case "instagram":
        navigator.clipboard.writeText(text);
        toast.success("Caption copied! Open Instagram to paste.");
        return;
    }
    window.open(url, "_blank");
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!shop) return <div className="p-8">Shop not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Share2 className="h-8 w-8" /> Share Your Shop Link
        </h1>
        <p className="text-muted-foreground">
          Share your link to get more orders on WhatsApp.
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 items-start">
        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-bold text-yellow-500 text-sm">
            Your shop link is your online identity. Share it everywhere!
          </h4>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Your Shop Link</CardTitle>
              <CardDescription>
                Share this link on Instagram, Facebook, or WhatsApp Status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2 bg-secondary/20 p-2 rounded-lg border border-border/50">
                <div className="flex-1 px-3 py-2 font-mono text-sm truncate text-primary">
                  {shopUrl}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCopy}
                  className="font-bold bg-[#E6B800] text-black hover:bg-[#FFD700]"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Share Directly
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 border-border/50 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-500"
                    onClick={() => handleShare("whatsapp")}
                  >
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 border-border/50 hover:bg-pink-500/10 hover:border-pink-500/50 hover:text-pink-500"
                    onClick={() => handleShare("instagram")}
                  >
                    <div className="p-2 bg-pink-500/20 rounded-full">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <span className="text-xs">Instagram</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 border-border/50 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-500"
                    onClick={() => handleShare("facebook")}
                  >
                    <div className="p-2 bg-blue-500/20 rounded-full">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <span className="text-xs">Facebook</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>How to Use Your Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-secondary rounded shrink-0">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <strong className="text-foreground block">
                    Add to WhatsApp Business profile
                  </strong>
                  Set as your business website in WhatsApp Business settings
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-secondary rounded shrink-0">
                  <Instagram className="w-4 h-4 text-pink-500" />
                </div>
                <div>
                  <strong className="text-foreground block">
                    Place in Instagram bio
                  </strong>
                  Add to your profile link so customers can browse easily
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-secondary rounded shrink-0">
                  <Share2 className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <strong className="text-foreground block">
                    Share when customers ask for prices
                  </strong>
                  Send directly in chat instead of sending multiple photos
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-1.5 bg-secondary rounded shrink-0">
                  <Printer className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <strong className="text-foreground block">
                    Print on stickers or boxes
                  </strong>
                  Use the QR code on packaging, menus, or visiting cards
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-secondary/10 border border-border/50 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#E6B800]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
                <p className="text-lg font-bold">
                  <span className="text-white">{stats.views}</span>{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    Views
                  </span>
                  <span className="mx-2 text-muted-foreground/30">|</span>
                  <span className="text-white">{stats.clicks}</span>{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    Clicks
                  </span>
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[#E6B800] hover:underline flex items-center gap-1"
            >
              Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>QR Code Download</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border-4 border-white">
                <QRCodeSVG
                  id="shop-qr"
                  value={`${shopUrl}?src=qr`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="w-full space-y-3">
                <Select value={qrFormat} onValueChange={setQrFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG (Print)</SelectItem>
                    <SelectItem value="story">Instagram Story</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="w-full gap-2 font-bold bg-[#E6B800] text-black hover:bg-[#FFD700]"
                  onClick={handleDownloadQR}
                >
                  <Download className="h-4 w-4" /> Download QR Code
                </Button>
              </div>

              <Link href={`/${shop.slug}`} target="_blank" className="w-full">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-border/50"
                >
                  <ExternalLink className="h-4 w-4" /> View My Shop
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
