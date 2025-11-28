"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, X, ShieldCheck, Server, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: isYearly ? "₹1,999" : "₹199",
      period: isYearly ? "/year" : "/month",
      desc: "For new WhatsApp sellers getting started.",
      features: [
        "Up to 50 products",
        "Basic themes",
        "Add-to-cart → WhatsApp orders",
        "Shop URL on BizoraPro",
        "Email support",
      ],
      highlight: false,
      btnText: "Get Started",
    },
    {
      name: "Business",
      price: isYearly ? "₹4,999" : "₹499",
      period: isYearly ? "/year" : "/month",
      desc: "For growing shops that want a premium brand feel.",
      features: [
        "Up to 300 products",
        "Premium themes + appearance controls",
        "Abandoned order tracking (MVP scope)",
        "Shop analytics (views, clicks)",
        "Priority WhatsApp support",
      ],
      highlight: true,
      btnText: "Most Popular",
    },
    {
      name: "Pro Plus",
      price: isYearly ? "₹9,999" : "₹999",
      period: isYearly ? "/year" : "/month",
      desc: "For serious brands and agencies managing multiple shops.",
      features: [
        "Up to 1,000 products",
        "Advanced themes & layout options",
        "Custom domain support (manual setup in MVP)",
        "Advanced analytics (top products, trends)",
        "1:1 onboarding call",
      ],
      highlight: false,
      btnText: "Talk to Us",
    },
  ];

  const comparisonRows: {
    name: string;
    starter: boolean | string;
    business: boolean | string;
    pro: boolean | string;
  }[] = [
    {
      name: "Shop URL on BizoraPro",
      starter: true,
      business: true,
      pro: true,
    },
    {
      name: "Add-to-cart → WhatsApp orders",
      starter: true,
      business: true,
      pro: true,
    },
    {
      name: "Theme customisation",
      starter: "Basic",
      business: "Premium",
      pro: "Advanced",
    },
    {
      name: "Product limit",
      starter: "50",
      business: "300",
      pro: "1,000",
    },
    {
      name: "Basic analytics dashboard",
      starter: false,
      business: true,
      pro: true,
    },
    {
      name: "Custom domain support",
      starter: false,
      business: "Manual setup",
      pro: "Priority setup",
    },
    {
      name: "Priority WhatsApp support",
      starter: false,
      business: true,
      pro: true,
    },
  ];

  return (
    <main className="bg-black text-foreground pb-20 pt-24">
      {/* HEADER + TOGGLE */}
      <section className="container mx-auto px-6 md:px-12 mb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Pricing
        </p>
        <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white">
          Simple pricing that{" "}
          <span className="text-primary">grows with your shop</span>
        </h1>
        <p className="mb-8 text-sm md:text-lg text-muted-foreground">
          Start free for a limited time. No GST required to begin. Cancel
          anytime from your dashboard.
        </p>

        <div className="flex items-center justify-center gap-4">
          <div className="relative inline-flex items-center rounded-full border border-white/15 bg-[#111] p-1">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                !isYearly
                  ? "bg-primary text-black shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                isYearly
                  ? "bg-primary text-black shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Yearly
            </button>

            {isYearly && (
              <div className="absolute -right-14 -top-3 rotate-2 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-black shadow-sm">
                Save more
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Yearly plans effectively give you a few months free compared to
          monthly billing.
        </p>
      </section>

      {/* PRICING CARDS */}
      <section className="container mx-auto mb-24 grid max-w-6xl grid-cols-1 gap-8 px-6 md:px-12 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Card
            key={plan.name + i}
            className={`relative flex flex-col border bg-[#111] ${
              plan.highlight
                ? "border-primary shadow-2xl shadow-primary/15 scale-[1.03] z-10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            {plan.highlight && (
              <div className="absolute inset-x-0 -top-3 flex justify-center">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
                  Recommended
                </span>
              </div>
            )}

            <CardHeader className="p-7 pb-4 md:p-8 md:pb-4">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {plan.name}
              </h3>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                {plan.desc}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-7 pt-2 md:p-8 md:pt-2">
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-xs md:text-sm text-gray-200"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3">
                <Link href="/signup" className="block">
                  <Button
                    className={`h-11 w-full text-sm md:h-12 md:text-lg font-bold ${
                      plan.highlight
                        ? "bg-primary text-black hover:bg-primary/90"
                        : "bg-primary text-black hover:bg-primary/90"
                    }`}
                  >
                    {plan.btnText}
                  </Button>
                </Link>
                <button
                  type="button"
                  className="w-full text-xs font-medium text-primary hover:underline"
                >
                  View sample shop for this plan
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* COMPARISON TABLE */}
      <section className="container mx-auto mb-24 max-w-5xl px-6 md:px-12">
        <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold text-white">
          Compare plans
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="grid grid-cols-4 border-b border-white/10 bg-[#151515] p-4 text-xs md:text-sm font-semibold text-gray-200">
            <div className="pl-4 text-left">Features</div>
            <div className="text-center">Starter</div>
            <div className="text-center text-primary">Business</div>
            <div className="text-center">Pro Plus</div>
          </div>

          {comparisonRows.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-4 items-center border-b border-white/5 p-4 text-xs md:text-sm hover:bg-white/5"
            >
              <div className="pl-4 text-gray-200">{row.name}</div>

              {/* Starter */}
              <div className="flex justify-center text-center">
                {typeof row.starter === "boolean" ? (
                  row.starter ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )
                ) : (
                  <span className="text-muted-foreground">{row.starter}</span>
                )}
              </div>

              {/* Business */}
              <div className="flex justify-center text-center">
                {typeof row.business === "boolean" ? (
                  row.business ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )
                ) : (
                  <span className="text-primary">{row.business}</span>
                )}
              </div>

              {/* Pro */}
              <div className="flex justify-center text-center">
                {typeof row.pro === "boolean" ? (
                  row.pro ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )
                ) : (
                  <span className="text-primary">{row.pro}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="container mx-auto mb-24 grid max-w-5xl grid-cols-1 gap-8 px-6 text-center md:grid-cols-3 md:px-12">
        {[
          {
            icon: ShieldCheck,
            title: "Secure billing",
            desc: "Payments handled via trusted Indian payment gateways.",
          },
          {
            icon: Server,
            title: "Managed hosting",
            desc: "99.9% uptime target for production environments.",
          },
          {
            icon: AlertCircle,
            title: "Cancel anytime",
            desc: "No lock-in. Stop your plan from the dashboard.",
          },
        ].map((item) => (
          <div key={item.title} className="flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#181818] text-primary">
              <item.icon className="h-6 w-6" />
            </div>
            <h4 className="mb-1 text-sm md:text-base font-semibold text-white">
              {item.title}
            </h4>
            <p className="max-w-xs text-[11px] md:text-xs text-muted-foreground">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="container mx-auto mb-24 max-w-3xl px-6 md:px-12">
        <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold text-white">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {[
            {
              q: "Do I need GST to start?",
              a: "No. You can start without GST. If you later enable online payments through a payment gateway, you may be asked for business details by that provider.",
            },
            {
              q: "How do customers place orders?",
              a: "Customers open your shop link, add items to the cart and tap “Order on WhatsApp”. A pre-filled WhatsApp message is generated with a tracking link to the order.",
            },
            {
              q: "Can I change my plan later?",
              a: "Yes. You can upgrade or downgrade plans from your dashboard. Changes usually apply from your next billing cycle, depending on the payment provider rules.",
            },
            {
              q: "What happens if I cancel?",
              a: "Your shop can be moved into a lightweight ‘catalog mode’ with limited features so that links you have shared don’t look broken.",
            },
          ].map((faq, i) => (
            <AccordionItem
              key={faq.q + i}
              value={`item-${i}`}
              className="rounded-xl border border-white/10 bg-[#111] px-4 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="py-4 text-left text-sm md:text-base text-white hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-xs md:text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto max-w-4xl px-6 text-center md:px-12">
        <h2 className="mb-4 text-2xl md:text-4xl font-bold text-white">
          Start free and share your shop link{" "}
          <span className="text-primary">today</span>
        </h2>
        <p className="mb-8 text-sm md:text-lg text-muted-foreground">
          Create your BizoraPro shop, add a few products and send the link to
          your best customers on WhatsApp.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup">
            <Button className="h-11 px-8 text-sm md:h-12 md:text-lg font-bold bg-primary text-black hover:bg-primary/90">
              Start free trial
            </Button>
          </Link>
          <button
            type="button"
            className="text-xs md:text-sm font-medium text-primary hover:underline"
          >
            View sample shop
          </button>
        </div>
      </section>
    </main>
  );
}