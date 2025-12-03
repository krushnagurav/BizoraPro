// src/app/(marketing)/contact/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // TODO — integrate with /api/contact later
    console.log("Contact Form:", Object.fromEntries(formData.entries()));

    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
          Get in Touch
        </h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-lg">
          Fast support for your business — on WhatsApp or email
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl grid gap-12 px-6 md:grid-cols-2">
        {/* Support Options */}
        <div className="space-y-7">
          {/* WhatsApp */}
          <div className="rounded-2xl border border-white/10 bg-[#111] p-8 transition-colors hover:border-primary/40">
            <div className="flex items-start gap-4">
              <span className="rounded-xl border border-primary/20 bg-primary/10 p-3">
                <MessageCircle className="h-7 w-7 text-primary" />
              </span>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-white">
                  WhatsApp Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fastest replies during working hours
                </p>
              </div>
            </div>

            <Button
              asChild
              className="mt-6 flex items-center gap-2 bg-primary text-black hover:bg-primary/90"
            >
              <a
                href="https://wa.me/your-number"
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                Message Us
              </a>
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              Mon–Sat, 10 AM – 7 PM IST
            </p>
          </div>

          {/* Email */}
          <div className="rounded-2xl border border-white/10 bg-[#111] p-8 transition-colors hover:border-white/20">
            <div className="flex items-start gap-4">
              <span className="rounded-xl border border-white/10 bg-white/5 p-3">
                <Mail className="h-7 w-7 text-white" />
              </span>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-white">
                  Email Support
                </h3>
                <a
                  href="mailto:support@bizorapro.com"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  support@bizorapro.com
                </a>
                <p className="mt-1 text-xs text-muted-foreground">
                  We respond within a few hours
                </p>
              </div>
            </div>
          </div>

          <p className="pl-2 text-sm text-muted-foreground">
            🇮🇳 Based in Surat, Gujarat
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-[#111] p-8 md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-white font-medium">
                Full Name *
              </label>
              <Input
                required
                name="name"
                id="name"
                placeholder="Your name"
                className="h-12 border-white/10 bg-black/40"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="business"
                className="text-sm text-white font-medium"
              >
                Business Name
              </label>
              <Input
                name="business"
                id="business"
                placeholder="(Optional)"
                className="h-12 border-white/10 bg-black/40"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm text-white font-medium">
                Phone / WhatsApp *
              </label>
              <Input
                required
                name="phone"
                id="phone"
                type="tel"
                placeholder="9876543210"
                className="h-12 border-white/10 bg-black/40"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-white font-medium">
                Email Address *
              </label>
              <Input
                required
                name="email"
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-12 border-white/10 bg-black/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm text-white font-medium">
              Message *
            </label>
            <Textarea
              required
              name="message"
              id="message"
              placeholder="Tell us how we can help you..."
              className="min-h-[140px] resize-none border-white/10 bg-black/40"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full bg-primary text-lg font-bold text-black hover:bg-primary/90"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We’ll reach out on WhatsApp or email
          </p>
        </form>
      </section>
    </>
  );
}