"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react"; // Use SVG for better scaling
import { Copy, Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ShareStorePage() {
  const [shop, setShop] = useState<any>(null);
  const [shopUrl, setShopUrl] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("shops").select("*").eq("owner_id", user.id).single();
        setShop(data);
        // Construct URL dynamically based on environment
        const baseUrl = window.location.origin;
        setShopUrl(`${baseUrl}/${data.slug}`);
      }
    };
    fetchShop();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(shopUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("shop-qr");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `${shop.slug}-qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
    toast.success("QR Code downloaded!");
  };

  const handleWhatsAppShare = () => {
    const text = `Check out my online shop! Order here: ${shopUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (!shop) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Share2 className="h-8 w-8" /> Share Store
        </h1>
        <p className="text-muted-foreground">Get customers to visit your shop.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* LEFT: Link Sharing */}
        <div className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Shop Link</CardTitle>
              <CardDescription>Share this link on Instagram, Facebook, or WhatsApp Status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={shopUrl} readOnly className="font-mono bg-secondary/20" />
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <a href={shopUrl} target="_blank" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" /> Visit
                  </Button>
                </a>
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white font-bold" onClick={handleWhatsAppShare}>
                   Share on WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-bold text-primary mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                Add this link to your <strong>Instagram Bio</strong> to get 3x more orders.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: QR Code */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Shop QR Code</CardTitle>
            <CardDescription>Print this and stick it on your shop counter.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <QRCodeSVG 
                id="shop-qr"
                value={shopUrl}
                size={200}
                level="H" // High error correction
                includeMargin={true}
              />
            </div>
            
            <Button variant="outline" className="w-full gap-2" onClick={handleDownloadQR}>
              <Download className="h-4 w-4" /> Download PNG
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}