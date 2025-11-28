// src/app/(marketing)/features/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Edit,
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Store,
  LayoutDashboard,
  Globe,
  BarChart3,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-16 md:py-24 text-center">
        <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] opacity-35" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-secondary/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
            ✨ All features
          </div>
          <h1 className="mb-4 text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
            Everything you need to grow your{" "}
            <span className="text-primary">WhatsApp business</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm md:text-lg text-muted-foreground">
            Premium storefront, add-to-cart, WhatsApp ordering and a simple
            dashboard — all in one place. Built for small businesses that sell
            through chat.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg font-bold bg-primary text-black hover:bg-primary/90"
            >
              Create shop link
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="bg-[#050507] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Core features of BizoraPro
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
              Designed for Indian WhatsApp-first businesses that want a clean,
              trustworthy online presence without complex tools.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Store,
                title: "Premium storefront",
                text: "Beautiful product listing with pricing and sections that build instant trust.",
              },
              {
                icon: MessageCircle,
                title: "Add-to-cart + WhatsApp",
                text: "Cart summary converts into a clean WhatsApp message in a single tap.",
              },
              {
                icon: QrCode,
                title: "Shareable QR code",
                text: "Print your QR on boards, cards or boxes — customers land directly on your shop.",
              },
              {
                icon: Smartphone,
                title: "Mobile-first design",
                text: "Optimised for Indian smartphones and 4G networks — fast and responsive.",
              },
              {
                icon: ShieldCheck,
                title: "Secure, managed hosting",
                text: "Hosted, secured and maintained for you. No servers or plugins to manage.",
              },
              {
                icon: Edit,
                title: "Easy product management",
                text: "Add, edit or hide products in seconds with images, prices and badges.",
              },
              {
                icon: BarChart3,
                title: "Basic analytics",
                text: "Track shop views, product interest and WhatsApp clicks (owner views excluded).",
              },
              {
                icon: Globe,
                title: "Custom domain (Pro)",
                text: "Upgrade to use your own domain name and look even more professional.",
              },
            ].map((item, i) => (
              <div
                key={item.title + i}
                className="group rounded-xl border border-white/5 bg-[#0C0C10] p-7 transition-all hover:border-primary/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-base md:text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPOTLIGHT 1: STOREFRONT */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:px-6 lg:px-8 md:flex-row">
          <div className="flex-1 space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Storefront
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Turn your WhatsApp catalogue into a{" "}
              <span className="text-primary">real online store</span>
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
              Instead of sending random photos in chat, share one clean link
              with organised products, clear pricing and a consistent brand
              experience.
            </p>
            <ul className="space-y-3">
              {[
                "Product cards with images, price, badges and short descriptions.",
                "Categories to separate sarees, combos, festive collections and more.",
                "Uniform grid layout with fixed image ratios so everything looks premium.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-xs md:text-sm text-slate-200">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#101018] shadow-2xl">
              <div className="space-y-3 text-center opacity-60">
                <Smartphone className="mx-auto h-20 w-20 text-white/15" />
                <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
                  STOREFRONT UI MOCKUP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT 2: ORDER FLOW */}
      <section className="bg-[#050507] py-16 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:px-6 lg:px-8 md:flex-row-reverse">
          <div className="flex-1 space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Ordering
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Seamless{" "}
              <span className="text-primary">WhatsApp ordering flow</span>
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
              Customers browse, add items to cart and send you a neat WhatsApp
              message. No confusing payment pages or abandoned checkout forms.
            </p>
            <ul className="space-y-3">
              {[
                "Simple “Add to cart” buttons built for mobile thumbs.",
                "Cart page with quantities, notes and order summary.",
                "Order message includes a secure tracking link instead of huge text blobs.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-xs md:text-sm text-slate-200">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#101018] shadow-2xl">
              <div className="space-y-3 text-center opacity-60">
                <MessageCircle className="mx-auto h-20 w-20 text-white/15" />
                <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
                  WHATSAPP FLOW MOCKUP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT 3: MANAGEMENT */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:px-6 lg:px-8 md:flex-row">
          <div className="flex-1 space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Management
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Manage your shop{" "}
              <span className="text-primary">from any device</span>
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
              The BizoraPro dashboard is designed for non-technical business
              owners. Update prices, photos and stock without touching code.
            </p>
            <ul className="space-y-3">
              {[
                "Clean dashboard showing products, orders and basic analytics.",
                "Bulk image uploads with compression to keep pages fast.",
                "Changes go live instantly on your public shop link.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-xs md:text-sm text-slate-200">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#101018] shadow-2xl">
              <div className="space-y-3 text-center opacity-60">
                <LayoutDashboard className="mx-auto h-20 w-20 text-white/15" />
                <p className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
                  DASHBOARD UI MOCKUP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="relative overflow-hidden border-t border-white/5 bg-[#050507] py-18 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.25),_transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-5 text-2xl md:text-4xl lg:text-5xl font-bold text-white">
            Start free — no GST, no app required
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-sm md:text-lg text-muted-foreground">
            Create your BizoraPro shop link in under 5 minutes, share it on
            WhatsApp and start taking organised orders today.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg font-bold bg-primary text-black hover:bg-primary/90"
              >
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link href="/examples">
              <Button
                variant="outline"
                size="lg"
                className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg border-white/20 text-white hover:bg-white/10"
              >
                View sample shops
              </Button>
            </Link>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground opacity-70">
            <ShieldCheck className="h-4 w-4" />
            Secure • No hidden charges • Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}