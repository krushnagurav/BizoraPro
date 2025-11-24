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
      name: "Basic",
      price: isYearly ? "₹4,999" : "₹499",
      period: isYearly ? "/year" : "/month",
      desc: "200 products • 5GB storage",
      features: ["200 products", "5GB storage", "WhatsApp orders", "QR code for shop", "Support: Email"],
      highlight: false,
      btnText: "Get Started"
    },
    {
      name: "Business",
      price: isYearly ? "₹9,999" : "₹999",
      period: isYearly ? "/year" : "/month",
      desc: "1000 products • 20GB storage",
      features: ["1000 products", "20GB storage", "Premium themes included", "WhatsApp automation", "Priority support"],
      highlight: true,
      btnText: "Get Started"
    },
    {
      name: "Premium",
      price: isYearly ? "₹19,999" : "₹1,999",
      period: isYearly ? "/year" : "/month",
      desc: "Unlimited • Custom Domain",
      features: ["Unlimited products & categories", "100GB storage", "Custom domain included", "Advanced analytics", "1:1 Onboarding"],
      highlight: false,
      btnText: "Start Premium"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-foreground pt-24 pb-20">
      
      {/* HEADER */}
      <div className="container px-6 md:px-12 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Choose the plan that <span className="text-primary">grows your business</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          14 days free. No GST. Cancel anytime.
        </p>

        {/* TOGGLE */}
        <div className="flex items-center justify-center gap-4">
          <div className="bg-[#111] p-1 rounded-lg border border-white/10 inline-flex items-center relative">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${!isYearly ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${isYearly ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'}`}
            >
              Yearly
            </button>
            
            {/* Badge */}
            <div className="absolute -top-3 -right-12 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full transform rotate-3">
              Save 58%
            </div>
          </div>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="container px-6 md:px-12 grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
        {plans.map((plan, i) => (
          <Card 
            key={i} 
            className={`bg-[#111] border relative flex flex-col ${plan.highlight ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10' : 'border-white/10 hover:border-white/20'}`}
          >
            {plan.highlight && (
              <div className="absolute top-0 inset-x-0 flex justify-center -mt-3">
                <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader className="p-8 pb-4">
              <h3 className={`text-2xl font-bold ${plan.highlight ? 'text-white' : 'text-white'}`}>{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 pt-2 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto space-y-4">
                <Link href="/signup" className="block">
                  <Button className={`w-full h-12 text-lg font-bold ${plan.highlight ? 'bg-primary text-black hover:bg-primary/90' : 'bg-primary text-black hover:bg-primary/90'}`}>
                    {plan.btnText}
                  </Button>
                </Link>
                <button className="w-full text-xs text-primary hover:underline">
                  View Sample Shop
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* COMPARISON TABLE */}
      <div className="container px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Compare Plans</h2>
        
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-[#151515] p-4 text-sm font-bold text-gray-300 border-b border-white/10">
            <div className="pl-4">Features</div>
            <div className="text-center">Basic</div>
            <div className="text-center text-primary">Business</div>
            <div className="text-center">Premium</div>
          </div>

          {/* Rows */}
          {[
            { name: "Shop URL", basic: true, business: true, premium: true },
            { name: "Add to Cart → WhatsApp Orders", basic: true, business: true, premium: true },
            { name: "Theme customization", basic: "Basic", business: "Premium", premium: "Advanced" },
            { name: "Storage limit", basic: "5GB", business: "20GB", premium: "100GB" },
            { name: "Accept UPI / Cards", basic: false, business: true, premium: true },
            { name: "Custom domain support", basic: false, business: false, premium: true },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-4 p-4 text-sm border-b border-white/5 hover:bg-white/5 items-center">
              <div className="pl-4 text-gray-300">{row.name}</div>
              <div className="text-center flex justify-center">
                {typeof row.basic === 'boolean' ? (row.basic ? <Check className="w-4 h-4 text-primary"/> : <X className="w-4 h-4 text-muted-foreground"/>) : <span className="text-muted-foreground">{row.basic}</span>}
              </div>
              <div className="text-center flex justify-center">
                {typeof row.business === 'boolean' ? (row.business ? <Check className="w-4 h-4 text-primary"/> : <X className="w-4 h-4 text-muted-foreground"/>) : <span className="text-primary">{row.business}</span>}
              </div>
              <div className="text-center flex justify-center">
                {typeof row.premium === 'boolean' ? (row.premium ? <Check className="w-4 h-4 text-primary"/> : <X className="w-4 h-4 text-muted-foreground"/>) : <span className="text-primary">{row.premium}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST SIGNALS */}
      <div className="container px-6 md:px-12 max-w-5xl mx-auto mb-24 grid md:grid-cols-3 gap-8 text-center">
        {[
          { icon: ShieldCheck, title: "Secure Payments", desc: "Razorpay/Stripe integration" },
          { icon: Server, title: "99.9% Uptime", desc: "Reliable hosting guaranteed" },
          { icon: AlertCircle, title: "Cancel Anytime", desc: "No long-term commitments" }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4 border border-white/10 text-primary">
              <item.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white mb-1">{item.title}</h4>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="container px-6 md:px-12 max-w-3xl mx-auto mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {[
            { q: "Is GST required?", a: "No, you can start without GST. However, for the Business/Premium plans using Razorpay, you might need to verify business details eventually." },
            { q: "How do customers place orders?", a: "Customers visit your link, add items to cart, and click 'Order on WhatsApp'. This opens their WhatsApp with a pre-filled message containing the order details sent to you." },
            { q: "Can I upgrade anytime?", a: "Yes! You can switch between plans instantly. The price difference will be adjusted automatically." }
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-[#111] rounded-lg px-4 data-[state=open]:border-primary/50">
              <AccordionTrigger className="text-white hover:no-underline py-4 text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* FOOTER CTA */}
      <div className="container px-6 md:px-12 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Start Free — Launch your Shop in Minutes
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of businesses already selling on WhatsApp
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <Button className="h-12 px-8 font-bold text-lg bg-primary text-black hover:bg-primary/90">
              Start Free Trial
            </Button>
          </Link>
          <button className="text-primary hover:underline">View Sample Shop</button>
        </div>
      </div>

    </div>
  );
}