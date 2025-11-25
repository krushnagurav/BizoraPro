import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Smartphone,
  TrendingUp,
  Tag,
  MessageCircle,
  Palette,
  Edit,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32">
        <div className="container px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
          {/* Left: Text */}
          <div className="flex-1 space-y-8 z-10 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              A Premium <br />
              Website for Your <br />
              <span className="text-primary">
                WhatsApp <br /> Business
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed">
              Showcase products beautifully. Get direct orders on WhatsApp. Turn
              your chat into a professional storefront in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg font-bold text-black bg-primary hover:bg-primary/90"
                >
                  Start Free
                </Button>
              </Link>
              <Link href="/examples">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-10 text-lg border-white/20 hover:bg-white/10"
                >
                  View Sample Shop
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="flex-1 w-full relative max-w-[600px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-[100px] opacity-30" />
            <div className="relative aspect-[4/3] bg-[#1A1A1A] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-4">
                <Smartphone
                  className="w-24 h-24 text-primary/20 mx-auto"
                  strokeWidth={1}
                />
                <p className="text-sm text-muted-foreground font-mono tracking-widest uppercase">
                  Phone Mockup Image
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Boost Trust & Sales",
                text: "Professional appearance increases customer confidence.",
              },
              {
                icon: Tag,
                title: "Catalog with Prices",
                text: "Display products clearly with transparent pricing.",
              },
              {
                icon: MessageCircle,
                title: "Direct WhatsApp Orders",
                text: "Seamless ordering through WhatsApp chat.",
              },
              {
                icon: Smartphone,
                title: "No GST / No App",
                text: "Simple solution without complications.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/5 rounded-xl p-8 text-center hover:border-primary/30 transition-colors group"
              >
                <item.icon className="w-10 h-10 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE SHOPS */}
      <section className="py-32 bg-background text-center">
        <div className="container px-6 md:px-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sample <span className="text-primary">Shops</span>
          </h2>
          <p className="text-muted-foreground mb-16">
            See how different businesses use BizoraPro
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Boutique",
                desc: "Luxury fashion store with premium styling",
              },
              {
                title: "Bakery",
                desc: "Sweet treats with warm, inviting design",
              },
              {
                title: "Salon",
                desc: "Modern beauty services with clean aesthetics",
              },
            ].map((shop, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/5 rounded-xl overflow-hidden text-left group hover:border-primary/50 transition-all"
              >
                <div className="aspect-[16/10] bg-[#1A1A1A] flex items-center justify-center border-b border-white/5">
                  <span className="text-muted-foreground text-sm">
                    Shop Preview Image
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{shop.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {shop.desc}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-white/10 group-hover:bg-primary group-hover:text-black transition-colors"
                  >
                    Open Demo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM FEATURES */}
      <section className="py-32 bg-[#0A0A0A]">
        <div className="container px-6 md:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Premium <span className="text-primary">Features</span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need for a professional online presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "Premium Themes",
                text: "Beautiful, professionally designed templates.",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp Orders",
                text: "Direct integration with WhatsApp Business.",
              },
              {
                icon: Edit,
                title: "Update Anytime",
                text: "Easy content management and updates.",
              },
              {
                icon: QrCode,
                title: "QR Code for Shop",
                text: "Easy sharing with QR code generation.",
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                text: "Optimized for mobile viewing experience.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Hosting",
                text: "Reliable and secure hosting infrastructure.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-5 p-6 rounded-xl bg-[#111] border border-white/5 hover:bg-[#151515] transition-colors"
              >
                <div className="shrink-0 mt-1">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-32 bg-background text-center">
        <div className="container px-6 md:px-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-muted-foreground mb-16">
            Choose the plan that works for you
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* MONTHLY */}
            <Card className="bg-[#111] border-white/10 hover:border-white/20 transition-all relative overflow-hidden text-left">
              <CardHeader className="p-8 border-b border-white/5 text-center bg-[#151515]">
                <h3 className="text-xl font-medium mb-2">Monthly</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">₹199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Perfect for starting out
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-10 flex flex-col items-center">
                <Link href="/signup" className="w-full">
                  <Button className="w-full h-14 font-bold text-lg bg-primary text-black hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* YEARLY */}
            <Card className="bg-[#111] border-primary shadow-2xl shadow-primary/10 relative overflow-hidden text-left scale-105 z-10">
              <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                Best Value
              </div>
              <CardHeader className="p-8 border-b border-white/5 text-center bg-[#151515]">
                <h3 className="text-xl font-medium mb-2">Yearly</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">₹999</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Save 58% with annual billing
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-10 flex flex-col items-center">
                <Link href="/signup" className="w-full">
                  <Button className="w-full h-14 font-bold text-lg bg-primary text-black hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <div className="inline-block bg-primary text-black font-bold px-8 py-4 rounded-md text-lg shadow-lg shadow-primary/20">
              No Hidden Fees. Cancel Anytime.
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-32 bg-black border-t border-white/5">
        <div className="container px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight">
            Turn Your WhatsApp Catalogue into a <br />
            Premium Website <span className="text-primary">Today</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-bold bg-primary text-black hover:bg-primary/90"
              >
                Create Shop Link
              </Button>
            </Link>
            <Link href="https://wa.me/your-number">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 text-lg border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp
                Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}