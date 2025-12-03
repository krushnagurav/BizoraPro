// src/app/(marketing)/features/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "BizoraPro Features — Premium WhatsApp Storefront & Smart Ordering",
  description:
    "Grow your WhatsApp business with a premium storefront, add-to-cart, WhatsApp ordering, analytics, custom domains, and secure hosting — all in one place.",
  openGraph: {
    title: "BizoraPro — WhatsApp Online Store Features",
    description:
      "Create a premium online shop for your WhatsApp business in under 5 minutes. Smart catalog, WhatsApp ordering, hosting, and basic analytics.",
    type: "website",
  },
};

export default function FeaturesPage() {
  return (
    <>
      {/* HERO */}
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative overflow-hidden py-16 md:py-24 text-center"
      >
        <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] opacity-35" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-secondary/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
            ✨ All features
          </span>

          <h1
            id="hero-heading"
            className="mb-4 text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white"
          >
            Everything you need to grow your{" "}
            <span className="text-primary">WhatsApp business</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-sm md:text-lg text-muted-foreground">
            Premium storefront, WhatsApp ordering and a simple dashboard —
            everything small businesses love.
          </p>

          <Button
            asChild
            size="lg"
            className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg font-bold bg-primary text-black hover:bg-primary/90"
          >
            <Link href="/signup">
              Create shop link
              <ArrowRight
                aria-hidden="true"
                className="ml-2 h-4 w-4 md:h-5 md:w-5"
              />
            </Link>
          </Button>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section
        id="core-features"
        aria-labelledby="core-features-heading"
        className="bg-[#050507] py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center space-y-2">
            <h2
              id="core-features-heading"
              className="text-2xl md:text-3xl font-bold text-white"
            >
              Core features of BizoraPro
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
              Built for WhatsApp-first businesses that need reliability and
              trust.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Store,
                title: "Premium storefront",
                text: "Showcase products beautifully with pricing, badges and categories.",
              },
              {
                icon: MessageCircle,
                title: "Add-to-cart + WhatsApp",
                text: "Order summary becomes a clean WhatsApp message.",
              },
              {
                icon: QrCode,
                title: "Shareable QR code",
                text: "Quick access for walk-in, events and packaging.",
              },
              {
                icon: Smartphone,
                title: "Mobile-first design",
                text: "Fast and responsive for 4G and budget Android devices.",
              },
              {
                icon: ShieldCheck,
                title: "Secure managed hosting",
                text: "No setup, no servers — we handle infrastructure.",
              },
              {
                icon: Edit,
                title: "Easy product management",
                text: "Update photos, prices and stock in seconds.",
              },
              {
                icon: BarChart3,
                title: "Basic analytics",
                text: "Track real interest and WhatsApp clicks.",
              },
              {
                icon: Globe,
                title: "Custom domain (Pro)",
                text: "Upgrade for your own domain and premium branding.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="group rounded-xl border border-white/5 bg-[#0C0C10] p-7 transition-all hover:border-primary/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <item.icon
                    aria-hidden="true"
                    className="h-6 w-6 text-primary"
                  />
                </div>
                <h3 className="mb-2 text-base md:text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SPOTLIGHT SECTIONS */}
      {[
        {
          id: "storefront",
          label: "Storefront",
          title: (
            <>
              Turn your WhatsApp catalogue into a{" "}
              <span className="text-primary">real online store</span>
            </>
          ),
          icon: Smartphone,
          list: [
            "Product cards with clean images and pricing.",
            "Categories for sarees, combos, festive collections and more.",
            "Uniform layout with fixed image ratios for premium look.",
          ],
          reverse: false,
        },
        {
          id: "ordering",
          label: "Ordering",
          title: (
            <>
              Seamless{" "}
              <span className="text-primary">WhatsApp ordering flow</span>
            </>
          ),
          icon: MessageCircle,
          list: [
            "Add-to-cart buttons designed for mobile thumbs.",
            "Cart with quantities, notes and order summary.",
            "Smart order message with tracking link.",
          ],
          reverse: true,
        },
        {
          id: "management",
          label: "Management",
          title: (
            <>
              Manage your shop{" "}
              <span className="text-primary">from any device</span>
            </>
          ),
          icon: LayoutDashboard,
          list: [
            "Dashboard for orders, products and basic analytics.",
            "Bulk image uploads with compression.",
            "Changes go live instantly — zero deployment.",
          ],
          reverse: false,
        },
      ].map(({ id, label, title, icon: Icon, list, reverse }) => (
        <section
          key={id}
          id={id}
          aria-labelledby={`${id}-heading`}
          className={`${
            reverse ? "bg-[#050507]" : "bg-background"
          } py-16 md:py-24`}
        >
          <div
            className={`mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:px-6 lg:px-8 ${
              reverse ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <div className="flex-1 space-y-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {label}
              </p>
              <h2
                id={`${id}-heading`}
                className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white"
              >
                {title}
              </h2>
              <ul className="space-y-3">
                {list.map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 text-primary"
                    />
                    <span className="text-xs md:text-sm text-slate-200">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full" aria-hidden="true">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#101018] shadow-2xl">
                <Icon className="mx-auto h-20 w-20 text-white/15" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA FOOTER */}
      <section
        aria-labelledby="final-cta-heading"
        className="relative overflow-hidden border-t border-white/5 bg-[#050507] py-18 md:py-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.25),_transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="final-cta-heading"
            className="mb-5 text-2xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Start free — no GST, no app required
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-sm md:text-lg text-muted-foreground">
            Create your BizoraPro shop link in under 5 minutes and start selling
            professionally today.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg font-bold bg-primary text-black hover:bg-primary/90"
            >
              <Link href="/signup">
                Start free trial
                <ArrowRight
                  aria-hidden="true"
                  className="ml-2 h-4 w-4 md:h-5 md:w-5"
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/examples">View sample shops</Link>
            </Button>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground opacity-70">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            Secure • No hidden charges • Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}