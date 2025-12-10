// src/app/(marketing)/contact/page.tsx
/*
 * Contact Page
 *
 * This page provides users with options to get in touch with BizoraPro support.
 * It includes a contact form and alternative methods such as WhatsApp and email.
 */
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";

type FormState = {
  name: string;
  business?: string;
  phone: string;
  email: string;
  message: string;
  website?: string;
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(
    null,
  );
  const liveRef = useRef<HTMLDivElement | null>(null);

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: FormState = {
      name: (fd.get("name") as string) || "",
      business: (fd.get("business") as string) || "",
      phone: (fd.get("phone") as string) || "",
      email: (fd.get("email") as string) || "",
      message: (fd.get("message") as string) || "",
      website: (fd.get("website") as string) || "",
    };

    if (!data.name || !data.phone || !data.email || !data.message) {
      setStatus({ ok: false, msg: "Please fill all required fields." });
      liveRef.current?.focus();
      return;
    }

    if (!validatePhone(data.phone)) {
      setStatus({ ok: false, msg: "Please enter a valid phone number." });
      liveRef.current?.focus();
      return;
    }

    if (data.website && data.website.trim() !== "") {
      setStatus({ ok: false, msg: "Submission looks like spam." });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus({
          ok: true,
          msg: "Thanks we’ll reach out on WhatsApp or email soon.",
        });
        form.reset();
      } else {
        const json = await res.json().catch(() => null);
        setStatus({
          ok: false,
          msg: json?.message || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        ok: false,
        msg: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
      liveRef.current?.focus();
    }
  };

  return (
    <>
      <section
        className="mx-auto max-w-4xl px-6 py-20 text-center"
        role="region"
        aria-labelledby="contact-heading"
      >
        <h1
          id="contact-heading"
          className="mb-4 text-3xl font-bold text-white md:text-5xl"
        >
          Get in Touch
        </h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-lg">
          Fast support for your business on WhatsApp or email
        </p>
      </section>

      <section
        className="mx-auto max-w-6xl grid gap-12 px-6 md:grid-cols-2"
        role="main"
      >
        <div className="space-y-7" aria-hidden={false}>
          <div
            className="rounded-2xl border border-white/10 bg-[#111] p-8 transition-colors hover:border-primary/40"
            role="region"
            aria-label="WhatsApp support"
          >
            <div className="flex items-start gap-4">
              <span
                className="rounded-xl border border-primary/20 bg-primary/10 p-3"
                aria-hidden="true"
              >
                <MessageCircle
                  className="h-7 w-7 text-primary"
                  aria-hidden="true"
                />
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
                rel="noopener noreferrer"
                aria-label="Chat with BizoraPro support on WhatsApp (opens in new tab)"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Message Us
              </a>
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              Mon–Sat, 10 AM – 7 PM IST
            </p>
          </div>

          <div
            className="rounded-2xl border border-white/10 bg-[#111] p-8 transition-colors hover:border-white/20"
            role="region"
            aria-label="Email support"
          >
            <div className="flex items-start gap-4">
              <span
                className="rounded-xl border border-white/10 bg-white/5 p-3"
                aria-hidden="true"
              >
                <Mail className="h-7 w-7 text-white" aria-hidden="true" />
              </span>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-white">
                  Email Support
                </h3>
                <a
                  href="mailto:support@bizorapro.com"
                  className="text-sm font-medium text-primary hover:underline"
                  aria-label="Email BizoraPro support"
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

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-[#111] p-8 md:p-10"
          aria-labelledby="contact-form-heading"
          noValidate
        >
          <h2 id="contact-form-heading" className="sr-only">
            Contact form
          </h2>

          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={""}
            onChange={() => {}}
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-white font-medium">
                Full Name <span className="sr-only">required</span>
              </label>
              <Input
                required
                name="name"
                id="name"
                placeholder="Your name"
                className="h-12 border-white/10 bg-black/40"
                autoComplete="name"
                aria-required="true"
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
                autoComplete="organization"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm text-white font-medium">
                Phone / WhatsApp <span className="sr-only">required</span>
              </label>
              <Input
                required
                name="phone"
                id="phone"
                type="tel"
                placeholder="9876543210"
                className="h-12 border-white/10 bg-black/40"
                inputMode="tel"
                pattern="[0-9+()\- ]{7,20}"
                aria-required="true"
                autoComplete="tel"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-white font-medium">
                Email Address <span className="sr-only">required</span>
              </label>
              <Input
                required
                name="email"
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-12 border-white/10 bg-black/40"
                autoComplete="email"
                aria-required="true"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm text-white font-medium">
              Message <span className="sr-only">required</span>
            </label>
            <Textarea
              required
              name="message"
              id="message"
              placeholder="Tell us how we can help you..."
              className="min-h-[140px] resize-none border-white/10 bg-black/40"
              aria-required="true"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full bg-primary text-lg font-bold text-black hover:bg-primary/90"
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We’ll reach out on WhatsApp or email
          </p>

          <div
            ref={liveRef}
            tabIndex={-1}
            aria-live="polite"
            aria-atomic="true"
            className="mt-2 min-h-[1.25rem] text-center"
          >
            {status ? (
              <div
                className={`mx-auto inline-block rounded-md px-3 py-1 text-sm ${
                  status.ok
                    ? "bg-emerald-600 text-black"
                    : "bg-red-600 text-white"
                }`}
                role="status"
              >
                {status.msg}
              </div>
            ) : null}
          </div>
        </form>
      </section>
    </>
  );
}
