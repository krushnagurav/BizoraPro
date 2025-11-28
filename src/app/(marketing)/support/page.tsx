import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
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

export default function SupportPage() {
  return (
    <main className="bg-black text-foreground pb-20">
      {/* HERO + SEARCH */}
      <section className="container mx-auto px-6 md:px-12 pt-28 pb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Help Center
        </p>
        <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white">
          How can we help you?
        </h1>
        <p className="mb-10 text-sm md:text-lg text-muted-foreground">
          Find quick answers or talk to our support team about your BizoraPro
          shop.
        </p>

        <div className="relative mx-auto max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search help articles (e.g. “create shop link”)"
            className="h-12 rounded-xl border-white/10 bg-[#111] pl-12 text-sm md:h-14 md:text-base focus:border-primary/50"
          />
        </div>
      </section>

      {/* MAIN SUPPORT CHANNELS */}
      <section className="container mx-auto mb-24 max-w-6xl px-6 md:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* WhatsApp */}
          <Link
            href="https://wa.me/your-number"
            className="group block rounded-2xl border border-white/10 bg-[#111] p-8 text-center transition-all hover:border-green-500/40"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 mx-auto group-hover:bg-green-500/20 transition-colors">
              <MessageCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="mb-2 text-lg md:text-xl font-bold text-white">
              WhatsApp support
            </h3>
            <p className="mb-6 text-xs md:text-sm text-muted-foreground">
              Get the fastest response directly on WhatsApp.
            </p>
            <Button className="h-11 w-full bg-green-600 text-xs md:text-sm font-bold text-white hover:bg-green-700">
              Message us on WhatsApp
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Mon–Sat, 10 AM – 7 PM IST
            </p>
          </Link>

          {/* Help Articles */}
          <button
            type="button"
            className="group flex flex-col rounded-2xl border border-white/10 bg-[#111] p-8 text-center transition-all hover:border-blue-500/40"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 mx-auto group-hover:bg-blue-500/20 transition-colors">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mb-2 text-lg md:text-xl font-bold text-white">
              Help articles
            </h3>
            <p className="mb-6 text-xs md:text-sm text-muted-foreground">
              Step-by-step guides to set up and manage your shop.
            </p>
            <Button className="h-11 w-full bg-blue-600 text-xs md:text-sm font-bold text-white hover:bg-blue-700">
              Browse help center
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Coming soon in app — links can later point to /docs.
            </p>
          </button>

          {/* Contact Support */}
          <Link
            href="/contact"
            className="group block rounded-2xl border border-white/10 bg-[#111] p-8 text-center transition-all hover:border-purple-500/40"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 mx-auto group-hover:bg-purple-500/20 transition-colors">
              <Headphones className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="mb-2 text-lg md:text-xl font-bold text-white">
              Contact support
            </h3>
            <p className="mb-6 text-xs md:text-sm text-muted-foreground">
              Submit a support request via our contact form.
            </p>
            <Button className="h-11 w-full bg-purple-600 text-xs md:text-sm font-bold text-white hover:bg-purple-700">
              Submit a request
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Ideal for billing or account issues.
            </p>
          </Link>
        </div>
      </section>

      {/* POPULAR TOPICS */}
      <section className="container mx-auto mb-24 max-w-4xl px-6 md:px-12">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Popular topics
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: LinkIcon,
              text: "How to create your shop link",
            },
            {
              icon: PlusCircle,
              text: "Add products quickly from your phone",
            },
            {
              icon: AlertTriangle,
              text: "WhatsApp orders not being received",
            },
            {
              icon: ArrowUpCircle,
              text: "Upgrading or downgrading your plan",
            },
            {
              icon: Key,
              text: "Resetting or changing your password",
            },
            {
              icon: Globe,
              text: "Enabling a custom domain for your shop",
            },
          ].map((topic) => (
            <button
              key={topic.text}
              type="button"
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#111] p-6 text-left text-sm text-gray-200 transition-all hover:border-white/20 hover:bg-[#141414]"
            >
              <topic.icon className="h-5 w-5 text-yellow-400" />
              <span>{topic.text}</span>
            </button>
          ))}
        </div>
      </section>

      {/* NEED MORE HELP */}
      <section className="container mx-auto mb-24 max-w-4xl px-6 md:px-12 text-center">
        <h2 className="mb-8 text-2xl font-bold text-white">Need more help?</h2>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Link
            href="https://wa.me/your-number"
            className="group rounded-xl border border-white/10 bg-[#111] p-8 transition-colors hover:border-green-500/60"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
              <MessageCircle className="h-6 w-6 text-black" />
            </div>
            <h3 className="font-bold text-white">WhatsApp support</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Best for quick setup and troubleshooting questions.
            </p>
          </Link>

          <a
            href="mailto:support@bizorapro.com"
            className="group rounded-xl border border-white/10 bg-[#111] p-8 transition-colors hover:border-blue-500/60"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-white">Email support</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              support@bizorapro.com
            </p>
          </a>
        </div>

        <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-white/10 bg-[#111] p-6">
          <h4 className="mb-1 text-sm font-bold text-white">Support hours</h4>
          <p className="text-xs text-muted-foreground">
            Monday – Saturday, 10:00 AM to 7:00 PM IST
          </p>
        </div>

        <p className="mt-4 text-xs font-medium text-yellow-400">
          We usually respond within a few hours on business days.
        </p>
      </section>

      {/* BOTTOM CTA */}
      <section className="pb-10 text-center">
        <Link href="/signup">
          <Button className="mb-4 h-11 px-8 text-sm md:h-12 md:text-lg font-bold bg-primary text-black hover:bg-primary/90">
            Create shop link — Free
          </Button>
        </Link>
        <div>
          <Link
            href="/"
            className="text-xs md:text-sm text-muted-foreground underline underline-offset-4 hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}