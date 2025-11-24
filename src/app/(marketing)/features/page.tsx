import { Card, CardContent } from "@/components/ui/card";
import { Palette, MessageCircle, Edit, QrCode, Smartphone, ShieldCheck } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="py-24 container px-6 md:px-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium <span className="text-primary">Features</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to run a professional online business without the technical headache.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: Palette, title: "Premium Themes", text: "Stand out with our Black & Gold luxury aesthetics." },
          { icon: MessageCircle, title: "WhatsApp Orders", text: "Receive formatted orders directly on your phone." },
          { icon: Edit, title: "Easy Updates", text: "Change prices and stock in seconds from your dashboard." },
          { icon: QrCode, title: "Instant QR Code", text: "Print your QR code for your physical shop counter." },
          { icon: Smartphone, title: "Mobile First", text: "Designed for the 80% of Indians shopping on phones." },
          { icon: ShieldCheck, title: "Secure Hosting", text: "We handle the servers, security, and speed for you." },
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all">
            <item.icon className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}