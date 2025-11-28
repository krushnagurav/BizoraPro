// src/app/(marketing)/examples/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shirt,
  Utensils,
  Scissors,
  Laptop,
  ShoppingCart,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const filters = [
  { name: "All Designs", icon: Sparkles },
  { name: "Fashion", icon: Shirt },
  { name: "Bakery", icon: Utensils },
  { name: "Salon", icon: Scissors },
  { name: "Electronics", icon: Laptop },
  { name: "Grocery", icon: ShoppingCart },
];

const shops = [
  {
    title: "Fashion Boutique",
    desc: "Elegant clothing store layout with hero banner, featured collections and a clean product grid.",
    tags: ["Add-to-Cart", "WhatsApp Orders", "Premium Theme"],
    imageColor: "bg-[#1E1E1E]",
    category: "Fashion",
  },
  {
    title: "Bakery Bliss",
    desc: "Warm, cozy design for home bakers and cafes, with daily specials and highlight cards.",
    tags: ["Add-to-Cart", "WhatsApp Orders", "Daily Specials"],
    imageColor: "bg-[#1E1E1E]",
    category: "Bakery",
  },
  {
    title: "Groom & Glam Salon",
    desc: "Modern salon layout with service sections, time slots and WhatsApp booking.",
    tags: ["Service Sections", "WhatsApp Booking"],
    imageColor: "bg-[#1E1E1E]",
    category: "Salon",
  },
  {
    title: "TechElectro",
    desc: "Clean electronics catalogue with spec highlights and category filters.",
    tags: ["Specs Highlight", "Add-to-Cart"],
    imageColor: "bg-[#1E1E1E]",
    category: "Electronics",
  },
  {
    title: "FreshGrocer",
    desc: "Simple grocery design with essentials, quick-add buttons and delivery notes.",
    tags: ["Quick Add", "WhatsApp Orders"],
    imageColor: "bg-[#1E1E1E]",
    category: "Grocery",
  },
  {
    title: "BeautyBliss",
    desc: "Premium cosmetics grid with badges for bestsellers and new arrivals.",
    tags: ["Bestseller Badge", "New Arrivals"],
    imageColor: "bg-[#1E1E1E]",
    category: "Beauty",
  },
];

export default function ExamplesPage() {
  return (
    <>
      {/* HEADER */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-12 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
          See how different businesses
          <br />
          <span className="text-primary">use BizoraPro</span>
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Explore ready-made layouts for boutiques, salons, bakeries and more.
          Each design is 100% WhatsApp-first and mobile-ready.
        </p>

        {/* FILTERS (visual only for now) */}
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((FilterIcon, index) => {
            const Icon = FilterIcon.icon;
            const isActive = index === 0; // “All Designs” looks active
            return (
              <button
                key={FilterIcon.name}
                type="button"
                className={
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs md:text-sm font-semibold transition-all " +
                  (isActive
                    ? "bg-primary text-black hover:bg-primary/90"
                    : "bg-[#101010] border border-white/10 text-muted-foreground hover:text-white hover:border-white/30")
                }
              >
                <Icon className="h-4 w-4" />
                {FilterIcon.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* SHOP GRID */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop, i) => (
            <div
              key={shop.title + i}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#060608] hover:border-primary/60 transition-all"
            >
              {/* Image / Screenshot Placeholder */}
              <div
                className={`relative aspect-[4/3] ${shop.imageColor} border-b border-white/5`}
              >
                <div className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  Mobile Ready
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="h-3/4 w-3/4 rounded-xl bg-white/10 rotate-2" />
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium text-slate-200">
                  {shop.category} template
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col h-full">
                <h3 className="mb-2 text-lg md:text-xl font-semibold text-white">
                  {shop.title}
                </h3>
                <p className="mb-5 text-xs md:text-sm text-muted-foreground line-clamp-2">
                  {shop.desc}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {shop.tags.map((tag, tIndex) => (
                    <span
                      key={tag + tIndex}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-auto w-full border-primary/40 text-primary hover:bg-primary hover:text-black transition-colors font-semibold text-sm"
                >
                  Open demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BY / MICRO TESTIMONIALS */}
      <section className="border-y border-white/5 bg-[#050507] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-10 text-[10px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Trusted by WhatsApp-first businesses across India
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-left">
            {[
              {
                text: "BizoraPro finally gave our boutique a link we’re proud to share on Instagram.",
                name: "Priya Sharma",
                role: "Fashion Boutique, Mumbai",
              },
              {
                text: "I send one link instead of 30 photos. Customers understand my menu instantly.",
                name: "Anjali Mehta",
                role: "Home Baker, Surat",
              },
              {
                text: "Setup took less than an hour. Now all my WhatsApp orders feel organised.",
                name: "Rahul Verma",
                role: "Electronics Store, Pune",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl bg-black/40 p-4"
              >
                <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
                <div>
                  <p className="mb-2 text-xs md:text-sm font-medium text-slate-100">
                    “{t.text}”
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.name}
                    <br />
                    <span className="text-[10px] opacity-80">{t.role}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-5">
          Launch your own shop in{" "}
          <span className="text-primary">under 5 minutes</span>
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          No credit card required. Create your shop link, add products and start
          taking WhatsApp orders — today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg font-semibold bg-primary text-black hover:bg-primary/90"
            >
              Create shop link
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="outline"
              size="lg"
              className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg border-white/20 hover:bg-white/10"
            >
              View pricing
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}