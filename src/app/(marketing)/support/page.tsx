// src/app/(marketing)/support/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  FileText,
  Headphones,
  Link as LinkIcon,
  PlusCircle,
  AlertTriangle,
  ArrowUpCircle,
  Key,
  Globe,
  Mail,
} from "lucide-react";
import { SearchBoxClient } from "@/src/components/marketing/SearchBoxClient";

export const metadata: Metadata = {
  title: "BizoraPro Support – Help Center & WhatsApp Support",
  description:
    "Get help with your BizoraPro shop. Search help articles, contact support over WhatsApp or email, and find quick answers to popular topics.",
};

export default function SupportPage() {
  return (
    <>
      {/* HERO + SEARCH */}
      <section
        className="container mx-auto px-6 pt-28 pb-16 text-center md:px-12"
        aria-labelledby="support-heading"
        role="region"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Help Center
        </p>
        <h1
          id="support-heading"
          className="mb-4 text-3xl font-bold text-white md:text-5xl"
        >
          How can we help you?
        </h1>
        <p className="mb-10 text-sm text-muted-foreground md:text-lg">
          Find quick answers or talk to our support team about your BizoraPro
          shop.
        </p>

        <SearchBoxClient action="/docs" />
      </section>

      {/* MAIN SUPPORT CHANNELS */}
      <section
        className="container mx-auto mb-24 max-w-6xl px-6 md:px-12"
        aria-labelledby="channels-heading"
        role="region"
      >
        <h2
          id="channels-heading"
          className="sr-only text-2xl font-bold text-white"
        >
          Main support channels
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* WhatsApp */}
          <div
            className="group rounded-2xl border border-white/10 bg-[#111] p-8 text-center transition-all hover:border-green-500/40"
            role="article"
            aria-label="WhatsApp support"
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 transition-colors group-hover:bg-green-500/20"
              aria-hidden="true"
            >
              <MessageCircle
                aria-hidden="true"
                className="h-8 w-8 text-green-500"
              />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white md:text-xl">
              WhatsApp support
            </h3>
            <p className="mb-6 text-xs text-muted-foreground md:text-sm">
              Get the fastest response directly on WhatsApp.
            </p>
            <Button
              className="h-11 w-full bg-green-600 text-xs font-bold text-white hover:bg-green-700 md:text-sm"
              asChild
            >
              <Link
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message BizoraPro support on WhatsApp (opens in new tab)"
              >
                Message us on WhatsApp
              </Link>
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Mon–Sat, 10 AM – 7 PM IST
            </p>
          </div>

          {/* Help Articles */}
          <div
            className="group flex flex-col rounded-2xl border border-white/10 bg-[#111] p-8 text-center transition-all hover:border-blue-500/40"
            role="article"
            aria-label="Help articles"
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 transition-colors group-hover:bg-blue-500/20"
              aria-hidden="true"
            >
              <FileText aria-hidden="true" className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white md:text-xl">
              Help articles
            </h3>
            <p className="mb-6 text-xs text-muted-foreground md:text-sm">
              Step-by-step guides to set up and manage your shop.
            </p>

            {/* use Link (no onClick) so page remains a server component */}
            <Button
              className="h-11 w-full bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 md:text-sm"
              asChild
            >
              <Link href="/docs" aria-label="Browse help center documentation">
                Browse help center
              </Link>
            </Button>

            <p className="mt-3 text-[11px] text-muted-foreground">
              Coming soon in app links can later point to /docs.
            </p>
          </div>

          {/* Contact Support */}
          <div
            className="group rounded-2xl border border-white/10 bg-[#111] p-8 text-center transition-all hover:border-purple-500/40"
            role="article"
            aria-label="Contact support"
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 transition-colors group-hover:bg-purple-500/20"
              aria-hidden="true"
            >
              <Headphones
                aria-hidden="true"
                className="h-8 w-8 text-purple-500"
              />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white md:text-xl">
              Contact support
            </h3>
            <p className="mb-6 text-xs text-muted-foreground md:text-sm">
              Submit a support request via our contact form.
            </p>
            <Button
              className="h-11 w-full bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 md:text-sm"
              asChild
            >
              <Link href="/contact" aria-label="Submit a support request">
                Submit a request
              </Link>
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Ideal for billing or account issues.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR TOPICS */}
      <section
        className="container mx-auto mb-24 max-w-4xl px-6 md:px-12"
        aria-labelledby="popular-topics-heading"
        role="region"
      >
        <h2
          id="popular-topics-heading"
          className="mb-8 text-center text-2xl font-bold text-white"
        >
          Popular topics
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: LinkIcon, text: "How to create your shop link" },
            { icon: PlusCircle, text: "Add products quickly from your phone" },
            { icon: AlertTriangle, text: "WhatsApp orders not being received" },
            { icon: ArrowUpCircle, text: "Upgrading or downgrading your plan" },
            { icon: Key, text: "Resetting or changing your password" },
            { icon: Globe, text: "Enabling a custom domain for your shop" },
          ].map((topic) => (
            <button
              key={topic.text}
              type="button"
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#111] p-6 text-left text-sm text-gray-200 transition-all hover:border-white/20 hover:bg-[#141414]"
              aria-label={`Open help topic: ${topic.text}`}
            >
              <topic.icon
                aria-hidden="true"
                className="h-5 w-5 text-yellow-400"
              />
              <span>{topic.text}</span>
            </button>
          ))}
        </div>
      </section>

      {/* NEED MORE HELP */}
      <section
        className="container mx-auto mb-24 max-w-4xl px-6 text-center md:px-12"
        aria-labelledby="more-help-heading"
        role="region"
      >
        <h2
          id="more-help-heading"
          className="mb-8 text-2xl font-bold text-white"
        >
          Need more help?
        </h2>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Link
            href="https://wa.me/your-number"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-white/10 bg-[#111] p-8 transition-colors hover:border-green-500/60"
            aria-label="Contact BizoraPro support on WhatsApp (opens in new tab)"
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500"
              aria-hidden="true"
            >
              <MessageCircle
                aria-hidden="true"
                className="h-6 w-6 text-black"
              />
            </div>
            <h3 className="font-bold text-white">WhatsApp support</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Best for quick setup and troubleshooting questions.
            </p>
          </Link>

          <a
            href="mailto:support@bizorapro.com"
            className="group rounded-xl border border-white/10 bg-[#111] p-8 transition-colors hover:border-blue-500/60"
            aria-label="Email BizoraPro support"
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500"
              aria-hidden="true"
            >
              <Mail aria-hidden="true" className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-white">Email support</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              support@bizorapro.com
            </p>
          </a>
        </div>

        <div
          className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-white/10 bg-[#111] p-6"
          role="region"
          aria-label="Support hours"
        >
          <h3 className="mb-1 text-sm font-bold text-white">Support hours</h3>
          <p className="text-xs text-muted-foreground">
            Monday – Saturday, 10:00 AM to 7:00 PM IST
          </p>
        </div>

        <p className="mt-4 text-xs font-medium text-yellow-400">
          We usually respond within a few hours on business days.
        </p>
      </section>

      {/* BOTTOM CTA */}
      <section
        className="pb-10 text-center"
        role="region"
        aria-label="Support call to action"
      >
        <Button
          asChild
          className="mb-4 h-11 px-8 text-sm font-bold bg-primary text-black hover:bg-primary/90 md:h-12 md:text-lg"
        >
          <Link href="/signup" aria-label="Create your BizoraPro shop link">
            Create shop link Free
          </Link>
        </Button>
        <div>
          <Link
            href="/"
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-white md:text-sm"
            aria-label="Back to home"
          >
            Back to home
          </Link>
        </div>
      </section>
    </>
  );
}
