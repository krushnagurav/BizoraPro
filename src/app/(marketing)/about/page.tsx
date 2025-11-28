// src/app/(marketing)/about/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        <div className="inline-block rounded-full border border-white/10 bg-[#141414] px-4 py-1.5 text-xs md:text-sm font-medium text-primary mb-6">
          Our Story
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
          Empowering every shop in <span className="text-primary">Bharat</span>{" "}
          to go online.
        </h1>

        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          BizoraPro was built with a simple mission: help the local kirana, the
          home baker, and the neighbourhood boutique look as professional online
          as the biggest brands — without needing an IT team.
        </p>
      </section>

      {/* VALUES */}
      <section className="border-y border-white/5 bg-[#050507] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              What we stand for
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Every decision in BizoraPro is driven by these three principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                icon: Heart,
                title: "Sellers first",
                text: "We don&apos;t charge commissions. Your hard-earned money stays with you. Our business grows only when yours does.",
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
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/10 bg-[#101015] p-7 hover:border-primary/40 transition-colors"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-lg md:text-xl font-semibold text-white">
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

      {/* FOUNDER NOTE */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="relative flex flex-col md:flex-row items-center gap-12 md:gap-16 rounded-3xl border border-white/10 bg-[#0C0C10] p-8 md:p-14 overflow-hidden">
          {/* Background glow */}
          <div className="pointer-events-none absolute -top-10 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          {/* Text */}
          <div className="relative z-10 flex-1 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              A note from the founder
            </h2>

            <div className="space-y-4 text-sm md:text-lg text-slate-200 leading-relaxed">
              <p>
                &quot;I watched local shopkeepers in my city struggle every day
                with WhatsApp orders. Sending 30–50 photos to every new
                customer, searching old chats for prices — it was chaos.&quot;
              </p>
              <p>
                &quot;BizoraPro is the tool I wish my friends and local
                businesses had earlier. It’s not just software; it’s a digital
                upgrade for your identity — a simple way to say, ‘We are
                professional. You can trust us.’&quot;
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-base md:text-lg font-semibold text-white">
                Krishna Gurav
              </p>
              <p className="text-xs md:text-sm text-primary">
                Founder, BizoraPro
              </p>
            </div>
          </div>

          {/* Visual */}
          <div className="relative z-10 flex-1 flex justify-center">
            <div className="flex h-56 w-56 md:h-64 md:w-64 items-center justify-center rounded-full border border-white/10 bg-[#15151F] shadow-2xl shadow-black/60">
              {/* Placeholder avatar / team icon – can be replaced with real photo later */}
              <Users className="h-20 w-20 md:h-24 md:w-24 text-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 text-center">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
          Ready to upgrade your WhatsApp business?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-xl mx-auto">
          Create your BizoraPro shop link, share it once, and stop sending the
          same photos again and again. Let your catalogue do the talking.
        </p>
        <Link href="/signup">
          <Button
            size="lg"
            className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-lg font-semibold bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            Start your journey
            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
      </section>
    </>
  );
}