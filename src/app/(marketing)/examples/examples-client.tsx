// src/app/(marketing)/examples/examples-client.tsx
/*  * Examples Client Component
 *
 * This client-side component renders the examples page showcasing
 * ready-made WhatsApp shop designs for various business types.
 * It includes filtering functionality and displays a grid of shop layouts.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
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

export function ExamplesClient() {
  const [activeFilter, setActiveFilter] = useState<string>("All Designs");

  const visibleShops =
    activeFilter === "All Designs"
      ? shops
      : shops.filter((shop) => shop.category === activeFilter);

  const tabListId = "examples-tabs";

  return (
    <>
      <section
        aria-labelledby="examples-heading"
        className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center sm:px-6 md:pt-20 lg:px-8"
      >
        <h1
          id="examples-heading"
          className="mb-5 text-3xl font-bold leading-tight md:text-5xl lg:text-6xl"
        >
          See how different businesses
          <br />
          <span className="text-primary">use BizoraPro</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-sm text-muted-foreground md:text-lg">
          Explore ready-made layouts for boutiques, salons, bakeries and more.
          Each design is 100% WhatsApp-first and mobile-ready.
        </p>

        <div
          className="flex flex-wrap justify-center gap-3"
          role="tablist"
          aria-label="Example templates by category"
          id={tabListId}
        >
          {filters.map((filter, idx) => {
            const Icon = filter.icon;
            const isActive = filter.name === activeFilter;
            const tabId = `tab-${idx}`;
            const panelId = `panel-${idx}`;

            return (
              <button
                key={filter.name}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                onClick={() => setActiveFilter(filter.name)}
                className={
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all md:text-sm " +
                  (isActive
                    ? "bg-primary text-black hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    : "border border-white/10 bg-[#101010] text-muted-foreground hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10")
                }
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{filter.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        aria-label="Example shop layouts"
        className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleShops.map((shop) => {
            const id = `example-${shop.title.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <article
                key={shop.title}
                id={id}
                role="article"
                aria-labelledby={`${id}-title`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#060608] transition-all hover:border-primary/60"
              >
                <div
                  className={`relative aspect-[4/3] ${shop.imageColor} border-b border-white/5`}
                  aria-hidden="true"
                >
                  <div
                    className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"
                    aria-hidden="true"
                  >
                    Mobile Ready
                  </div>
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-20"
                    aria-hidden="true"
                  >
                    <div className="h-3/4 w-3/4 rotate-2 rounded-xl bg-white/10" />
                  </div>
                  <div
                    className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium text-slate-200"
                    aria-hidden="true"
                  >
                    {shop.category} template
                  </div>
                </div>

                <div className="flex h-full flex-col p-6">
                  <h2
                    id={`${id}-title`}
                    className="mb-2 text-lg font-semibold text-white md:text-xl"
                  >
                    {shop.title}
                  </h2>
                  <p className="mb-5 line-clamp-2 text-xs text-muted-foreground md:text-sm">
                    {shop.desc}
                  </p>

                  <div
                    className="mb-6 flex flex-wrap gap-2"
                    aria-hidden="false"
                  >
                    {shop.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-auto w-full border-primary/40 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-black"
                    asChild
                  >
                    <Link
                      href={`/examples/${encodeURIComponent(shop.title.toLowerCase().replace(/\s+/g, "-"))}`}
                      aria-label={`Open demo for ${shop.title}`}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        Open demo
                        <ArrowRight
                          aria-hidden="true"
                          className="ml-2 h-4 w-4 md:h-5 md:w-5"
                        />
                      </span>
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#050507] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-10 text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">
            Trusted by WhatsApp-first businesses across India
          </p>

          <div className="grid gap-6 text-left md:grid-cols-3">
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
            ].map((t) => (
              <figure
                key={t.name}
                className="flex items-start gap-3 rounded-2xl bg-black/40 p-4"
              >
                <div
                  className="h-10 w-10 shrink-0 rounded-full bg-white/10"
                  aria-hidden="true"
                />
                <div>
                  <blockquote className="mb-2 text-xs font-medium text-slate-100 md:text-sm">
                    “{t.text}”
                  </blockquote>
                  <figcaption className="text-[11px] text-muted-foreground">
                    {t.name}
                    <br />
                    <span className="text-[10px] opacity-80">{t.role}</span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 md:py-24 lg:px-8">
        <h2 className="mb-5 text-2xl font-bold md:text-4xl lg:text-5xl">
          Launch your own shop in{" "}
          <span className="text-primary">under 5 minutes</span>
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-sm text-muted-foreground md:text-lg">
          No credit card required. Create your shop link, add products and start
          taking WhatsApp orders today.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-sm font-semibold bg-primary text-black hover:bg-primary/90 md:h-14 md:px-10 md:text-lg"
          >
            <Link href="/signup" aria-label="Create BizoraPro shop link">
              <span className="inline-flex items-center gap-2">
                Create shop link
                <ArrowRight
                  aria-hidden="true"
                  className="ml-2 h-4 w-4 md:h-5 md:w-5"
                />
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-sm border-white/20 hover:bg-white/10 md:h-14 md:px-10 md:text-lg"
          >
            <Link href="/pricing" aria-label="View BizoraPro pricing">
              View pricing
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
