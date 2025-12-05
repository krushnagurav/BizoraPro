// src/app/(marketing)/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
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
  Store,
  ImageIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "BizoraPro – Premium WhatsApp Website for Indian Small Businesses",
  description:
    "Create a premium online shop for your WhatsApp business in under 5 minutes. Clean product catalog, WhatsApp cart checkout and mobile-first UI built for Indian sellers.",
  openGraph: {
    title: "BizoraPro – Premium Website for Your WhatsApp Business",
    description:
      "Showcase your catalogue, accept cart-based orders on WhatsApp and build trust with a premium online shop.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section
        id="home"
        aria-labelledby="hero-heading"
        className="relative pt-20 pb-20 md:pt-28 md:pb-28 overflow-hidden"
      >
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left: Text */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
              WhatsApp Commerce · Made Premium
            </span>

            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]"
            >
              A Premium Website
              <br />
              for Your{" "}
              <span className="text-primary">
                WhatsApp
                <br className="hidden md:block" /> Business
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed">
              Showcase your catalogue beautifully, accept cart-based orders on
              WhatsApp, and give your business a trusted online home in under 5
              minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <Button
                asChild
                className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg font-semibold text-black bg-primary hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <Link href="/signup">Start Free</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg border-white/20 bg-transparent text-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <Link href="/examples">View Sample Shop</Link>
              </Button>
            </div>

            <p className="text-xs md:text-sm text-muted-foreground pt-1">
              No app to install · No coding · No commission on orders
            </p>
          </div>

          {/* Right: Phone Mockup / Preview */}
          <div className="flex-1 w-full max-w-[520px]" aria-hidden="true">
            <div className="relative aspect-[4/3] rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-[0_0_120px_rgba(0,0,0,0.7)] overflow-hidden">
              {/* Inner frame */}
              <div className="absolute inset-5 rounded-2xl border border-white/5 bg-black/60 backdrop-blur-sm flex">
                {/* Left: shop header + metrics */}
                <div className="flex-1 flex flex-col gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Store
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                        Demo Shop
                      </p>
                      <p className="text-sm font-semibold">Mahira Boutique</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-lg bg-white/5 px-3 py-2">
                      <p className="text-[10px] text-muted-foreground">Views</p>
                      <p className="text-sm font-semibold">1,245</p>
                    </div>
                    <div className="rounded-lg bg-white/5 px-3 py-2">
                      <p className="text-[10px] text-muted-foreground">
                        WA Orders
                      </p>
                      <p className="text-sm font-semibold">87</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 px-3 py-2">
                      <p className="text-[10px] text-primary">Status</p>
                      <p className="text-xs font-semibold text-primary">
                        Open · Today
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Your Shop Link
                      </p>
                      <p className="font-mono text-[11px] truncate">
                        bizorapro.com/mahira-boutique
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 rounded-full bg-primary text-black hover:bg-primary/90 text-xs px-3"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Right: product preview column */}
                <div className="hidden md:flex w-40 flex-col border-l border-white/5 bg-black/40">
                  <div className="p-3 border-b border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Cart</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                      3 items
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 overflow-hidden p-3 text-[11px]">
                    <div className="flex gap-2 items-center">
                      <div className="h-8 w-8 rounded-md bg-zinc-800 flex items-center justify-center">
                        <ImageIcon
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="truncate">Emerald Silk Saree</p>
                        <p className="text-[10px] text-muted-foreground">
                          ₹1,999 · Qty 1
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="h-8 w-8 rounded-md bg-zinc-800 flex items-center justify-center">
                        <ImageIcon
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="truncate">Georgette Kurti</p>
                        <p className="text-[10px] text-muted-foreground">
                          ₹899 · Qty 2
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">₹3,797</span>
                      </div>
                      <Button className="w-full h-8 text-[11px] bg-emerald-500 text-black hover:bg-emerald-400 flex items-center justify-center gap-1">
                        <MessageCircle className="h-3 w-3" aria-hidden="true" />
                        Order on WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="py-16 md:py-20 border-y border-white/5 bg-black/40"
      >
        <div className="mx-auto max-w-5xl text-center space-y-10">
          <div>
            <h2
              id="how-it-works-heading"
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              How BizoraPro Works
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              No complex setup. No coding. Just three simple steps to turn your
              WhatsApp business into a premium online store.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 text-left">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                  Step 1
                </p>
              </div>
              <h3 className="text-base md:text-lg font-semibold">
                Create your shop
              </h3>
              <p className="text-sm text-muted-foreground">
                Sign up with your email and WhatsApp number. Pick a shop name
                and get your link in under 30 seconds.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <ImageIcon
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                  Step 2
                </p>
              </div>
              <h3 className="text-base md:text-lg font-semibold">
                Add products & prices
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload product photos, set prices, and organize into categories.
                Your catalogue instantly looks clean and premium.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                  Step 3
                </p>
              </div>
              <h3 className="text-base md:text-lg font-semibold">
                Share & get orders
              </h3>
              <p className="text-sm text-muted-foreground">
                Share your BizoraPro link or QR code. Customers add items to
                cart and place orders directly on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section
        id="why"
        aria-labelledby="why-heading"
        className="py-20 bg-[#050509]"
      >
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="text-center space-y-3">
            <h2 id="why-heading" className="text-2xl md:text-3xl font-bold">
              Why sellers love BizoraPro
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Built specifically for Indian small businesses who already sell on
              WhatsApp, not a generic foreign e-commerce tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Boost trust & sales",
                text: "A premium link makes your business look serious and reliable – no more random Google Drive photos.",
              },
              {
                icon: Tag,
                title: "Clear catalog & prices",
                text: "Customers can browse everything in one place instead of scrolling through old chats.",
              },
              {
                icon: MessageCircle,
                title: "Cart → WhatsApp",
                text: "Your customer adds items to cart and confirms the order in a single WhatsApp message.",
              },
              {
                icon: Smartphone,
                title: "No app. No GST headache.",
                text: "Runs completely on the web. You keep 100% of your payment and manage it your way.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="bg-[#0B0B0F] border border-white/5 rounded-xl p-7 text-left hover:border-primary/40 transition-colors group"
              >
                <item.icon
                  className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-base md:text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE SHOPS */}
      <section
        id="examples"
        aria-labelledby="examples-heading"
        className="py-24 bg-background"
      >
        <div className="mx-auto max-w-6xl text-center">
          <h2
            id="examples-heading"
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            Sample <span className="text-primary">Shops</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-12">
            See how different businesses can style their BizoraPro shop.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                title: "Boutique",
                desc: "Dark, luxurious layout for fashion brands.",
              },
              {
                title: "Bakery",
                desc: "Warm and inviting for home bakers & cafes.",
              },
              {
                title: "Salon",
                desc: "Clean, minimal look for beauty and grooming.",
              },
            ].map((shop) => (
              <article
                key={shop.title}
                className="bg-[#0B0B0F] border border-white/5 rounded-2xl overflow-hidden text-left group hover:border-primary/60 transition-all"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center border-b border-white/5">
                  <span className="text-[11px] text-muted-foreground">
                    Demo preview – replace with real screenshots later
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{shop.title}</h3>
                  <p className="text-sm text-muted-foreground">{shop.desc}</p>
                  <Button
                    variant="outline"
                    className="w-full border-white/15 bg-transparent text-xs md:text-sm group-hover:bg-primary group-hover:text-black transition-colors"
                  >
                    Open Demo
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM FEATURES */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="py-24 bg-[#050509]"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2
              id="features-heading"
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              Premium <span className="text-primary">Features</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Everything you need to look premium online and keep WhatsApp at
              the center of your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "Premium themes",
                text: "Curated layouts for boutiques, salons, bakeries, kirana and more.",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp-first checkout",
                text: "Cart converts into a clean WhatsApp order message with tracking link.",
              },
              {
                icon: Edit,
                title: "Update anytime",
                text: "Add new arrivals, update prices and toggle out-of-stock in seconds.",
              },
              {
                icon: QrCode,
                title: "Smart QR code",
                text: "Print your shop QR on packaging, visiting cards and boards.",
              },
              {
                icon: Smartphone,
                title: "Mobile-first UI",
                text: "Designed for Indian customers browsing on 4G and budget phones.",
              },
              {
                icon: ShieldCheck,
                title: "Secure hosting",
                text: "Fast, secure hosting on modern cloud infrastructure – no DevOps needed.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-5 rounded-xl bg-[#0B0B0F] border border-white/5 hover:bg-[#101018] transition-colors"
              >
                <div className="mt-1">
                  <item.icon
                    className="w-7 h-7 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        aria-labelledby="pricing-heading"
        className="py-24 bg-background"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="pricing-heading"
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            Simple <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-12">
            No commission on orders. One small fee for a premium online shop.
          </p>

          <div className="grid md:grid-cols-2 gap-7">
            {/* Monthly */}
            <Card className="bg-[#0B0B0F] border-white/10 hover:border-white/25 transition-all text-left">
              <CardHeader className="p-7 border-b border-white/5 text-center bg-[#101018]">
                <h3 className="text-lg font-medium mb-1">Monthly</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    ₹199
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    /month
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-3">
                  Try BizoraPro with full control, cancel anytime.
                </p>
              </CardHeader>
              <CardContent className="p-7 flex flex-col gap-4">
                <ul className="space-y-1.5 text-xs md:text-sm text-muted-foreground">
                  <li>Up to 200 products</li>
                  <li>WhatsApp cart checkout</li>
                  <li>Premium themes included</li>
                </ul>
                <Button
                  asChild
                  className="w-full h-12 font-semibold bg-primary text-black hover:bg-primary/90 mt-2"
                >
                  <Link href="/signup">Get Started Monthly</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Yearly */}
            <Card className="bg-[#0B0B0F] border-primary shadow-2xl shadow-primary/15 relative overflow-hidden text-left">
              <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.15em]">
                Best Value
              </div>
              <CardHeader className="p-7 border-b border-white/5 text-center bg-[#15151F]">
                <h3 className="text-lg font-medium mb-1">Yearly</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    ₹999
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    /year
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-3">
                  Save more than 50% vs monthly billing.
                </p>
              </CardHeader>
              <CardContent className="p-7 flex flex-col gap-4">
                <ul className="space-y-1.5 text-xs md:text-sm text-muted-foreground">
                  <li>Everything in Monthly</li>
                  <li>Priority feature access</li>
                  <li>Best for serious sellers</li>
                </ul>
                <Button
                  asChild
                  className="w-full h-12 font-semibold bg-primary text-black hover:bg-primary/90 mt-2"
                >
                  <Link href="/signup">Get Started Yearly</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary text-black font-semibold px-6 py-3 text-xs md:text-sm shadow-lg shadow-primary/25">
              No hidden fees · Cancel anytime · You keep 100% of your revenue
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        aria-labelledby="final-cta-heading"
        className="py-24 bg-black border-t border-white/10"
      >
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <h2
            id="final-cta-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
          >
            Turn your WhatsApp catalogue into a{" "}
            <span className="text-primary">premium website</span> today.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Share one simple link instead of 50 photos in chat. BizoraPro makes
            your business look trustworthy and easy to buy from.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg font-semibold bg-primary text-black hover:bg-primary/90"
            >
              <Link href="/signup">Create Your Shop Link</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg border-white/25 text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Link
                href="https://wa.me/your-number"
                aria-label="Chat with BizoraPro support on WhatsApp"
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle
                    className="w-4 h-4 text-green-500"
                    aria-hidden="true"
                  />
                  WhatsApp Support
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
