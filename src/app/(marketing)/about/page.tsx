// src/app/(marketing)/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About BizoraPro – Built for Indian WhatsApp Businesses",
  description:
    "BizoraPro is built in Surat, Gujarat to help Indian WhatsApp-first businesses look professional online without an IT team. Sellers first. Made in India. Radically simple.",
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section
        className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-20 lg:px-8"
        aria-labelledby="about-heading"
        role="region"
      >
        <div className="mb-6 inline-block rounded-full border border-white/10 bg-[#141414] px-4 py-1.5 text-xs font-medium text-primary md:text-sm">
          Our Story
        </div>

        <h1
          id="about-heading"
          className="mb-6 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
        >
          Empowering every shop in <span className="text-primary">Bharat</span>{" "}
          to go online.
        </h1>

        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-lg">
          BizoraPro was built with a simple mission: help the local kirana, the
          home baker and the neighbourhood boutique look as professional online
          as the biggest brands without needing an IT team.
        </p>
      </section>

      {/* VALUES */}
      <section
        className="border-y border-white/5 bg-[#050507] py-16 md:py-20"
        aria-labelledby="values-heading"
        role="region"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-2 text-center">
            <h2
              id="values-heading"
              className="text-2xl font-bold text-white md:text-3xl"
            >
              What we stand for
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
              Every decision in BizoraPro is driven by these three principles.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Sellers first",
                text: "We don’t charge commissions. Your hard-earned money stays with you. Our business grows only when yours does.",
              },
              {
                icon: MapPin,
                title: "Made in India",
                text: "Built from Surat, Gujarat, for Indian small businesses. We understand WhatsApp-first selling and local challenges.",
              },
              {
                icon: TrendingUp,
                title: "Radical simplicity",
                text: "No coding. No complex setup. If you can use WhatsApp, you can use BizoraPro. Tech should not get in your way.",
              },
            ].map((item) => {
              const id = item.title.toLowerCase().replace(/\s+/g, "-");
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  aria-labelledby={`${id}-title`}
                  className="group rounded-2xl border border-white/10 bg-[#101015] p-7 transition-colors hover:border-primary/40"
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary/20"
                    aria-hidden="true"
                  >
                    <Icon aria-hidden="true" className="h-6 w-6 text-primary" />
                  </div>
                  <h3
                    id={`${id}-title`}
                    className="mb-3 text-lg font-semibold text-white md:text-xl"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8"
        role="region"
        aria-labelledby="founder-heading"
      >
        <div className="relative flex flex-col items-center gap-12 overflow-hidden rounded-3xl border border-white/10 bg-[#0C0C10] p-8 md:flex-row md:gap-16 md:p-14">
          {/* Background glow (decorative) */}
          <div
            className="pointer-events-none absolute -top-10 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Text */}
          <div className="relative z-10 flex-1 space-y-6">
            <h2
              id="founder-heading"
              className="text-2xl font-bold text-primary md:text-3xl"
            >
              A note from the founder
            </h2>

            <div className="space-y-4 text-sm leading-relaxed text-slate-200 md:text-lg">
              <p>
                “I watched local shopkeepers in my city struggle every day with
                WhatsApp orders. Sending 30–50 photos to every new customer,
                searching old chats for prices it was chaos.”
              </p>
              <p>
                “BizoraPro is the tool I wish my friends and local businesses
                had earlier. It’s not just software; it’s a digital upgrade for
                your identity a simple way to say, ‘We are professional. You can
                trust us.’”
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-primary md:text-sm">
                Founder, BizoraPro
              </p>
            </div>
          </div>

          {/* Visual */}
          <div
            className="relative z-10 flex flex-1 justify-center"
            aria-hidden="false"
            role="img"
            aria-label="Founder's portrait placeholder"
          >
            <div className="flex h-56 w-56 items-center justify-center rounded-full border border-white/10 bg-[#15151F] shadow-2xl shadow-black/60 md:h-64 md:w-64">
              {/* Placeholder avatar – replace with real photo later */}
              <Users
                aria-hidden="true"
                className="h-20 w-20 text-white/10 md:h-24 md:w-24"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        className="mx-auto max-w-4xl px-4 pb-16 text-center sm:px-6 md:pb-20 lg:px-8"
        role="region"
        aria-labelledby="about-cta-heading"
      >
        <h2
          id="about-cta-heading"
          className="mb-6 text-2xl font-bold text-white md:text-4xl lg:text-5xl"
        >
          Ready to upgrade your WhatsApp business?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm text-muted-foreground md:text-base">
          Create your BizoraPro shop link, share it once, and stop sending the
          same photos again and again. Let your catalogue do the talking.
        </p>
        <Button
          asChild
          size="lg"
          className="h-12 px-8 text-sm font-semibold bg-primary text-black shadow-lg shadow-primary/20 hover:bg-primary/90 md:h-14 md:px-10 md:text-lg"
        >
          <Link href="/signup" aria-label="Start your BizoraPro signup">
            <span className="inline-flex items-center gap-2">
              Start your journey
              <ArrowRight
                aria-hidden="true"
                className="ml-2 h-4 w-4 md:h-5 md:w-5"
              />
            </span>
          </Link>
        </Button>
      </section>
    </>
  );
}
