import type { Metadata } from "next";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Legal, Terms & Policies – BizoraPro India",
  description:
    "Review BizoraPro’s Privacy Policy, Terms of Service and Refund Policy. We comply with Indian privacy and consumer protection requirements.",
};

export default function LegalPage() {
  return (
    <>
      <section
        className="container mx-auto max-w-4xl px-6 md:px-12"
        aria-labelledby="legal-heading"
      >
        {/* Header */}
        <header
          id="legal-heading"
          className="mb-10 text-center space-y-3"
          role="banner"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Legal & Compliance
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Legal, Terms & Policies
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Please review these documents carefully. By using BizoraPro, you
            agree to all of the terms and policies listed here.
          </p>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#0e0e0e] border border-white/10 rounded-xl p-1">
            <TabsTrigger
              value="privacy"
              className="text-xs md:text-sm py-2 rounded-lg transition-all
data-[state=active]:bg-primary data-[state=active]:text-black
hover:bg-white/10"
            >
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="text-xs md:text-sm py-2 rounded-lg transition-all
data-[state=active]:bg-primary data-[state=active]:text-black
hover:bg-white/10"
            >
              Terms of Service
            </TabsTrigger>
            <TabsTrigger
              value="refund"
              className="text-xs md:text-sm py-2 rounded-lg transition-all
data-[state=active]:bg-primary data-[state=active]:text-black
hover:bg-white/10"
            >
              Refund Policy
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#111] p-6 md:p-8 text-sm md:text-base leading-relaxed text-slate-200 space-y-8">
            {/* PRIVACY */}
            <TabsContent value="privacy">
              <h2 className="mb-1 text-xl md:text-2xl font-bold text-white">
                Privacy Policy
              </h2>
              <p className="mb-6 text-xs text-muted-foreground">
                Last updated: {new Date().getFullYear()}
              </p>

              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <strong>Introduction</strong>
                  <p className="mt-1">
                    BizoraPro provides tools for shop owners to create a
                    mini-website and manage WhatsApp-based orders. This Privacy
                    Policy explains how we collect and protect your information.
                  </p>
                </li>

                <li>
                  <strong>Information We Collect</strong>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>Account data (name, email, phone, business details)</li>
                    <li>Shop data (products, pricing, images)</li>
                    <li>Usage analytics (excluding owner self-view events)</li>
                  </ul>
                </li>

                <li>
                  <strong>How We Use Your Data</strong>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>Provide and improve BizoraPro services</li>
                    <li>Operate store pages and dashboard</li>
                    <li>Send important account notifications</li>
                  </ul>
                </li>

                <li>
                  <strong>Data Sharing</strong>
                  <p className="mt-1">
                    Only with trusted Indian providers when necessary
                    (infrastructure, analytics, billing). We never sell your
                    data.
                  </p>
                </li>

                <li>
                  <strong>Your Rights</strong>
                  <p className="mt-1">
                    To request correction or deletion, contact{" "}
                    <Link
                      href="mailto:support@bizorapro.com"
                      className="text-primary underline"
                    >
                      support@bizorapro.com
                    </Link>
                    .
                  </p>
                </li>
              </ol>
            </TabsContent>

            {/* TERMS */}
            <TabsContent value="terms">
              <h2 className="mb-1 text-xl md:text-2xl font-bold text-white">
                Terms of Service
              </h2>
              <p className="mb-6 text-xs text-muted-foreground">
                Last updated: {new Date().getFullYear()}
              </p>

              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <strong>Acceptance of Terms</strong>
                  <p className="mt-1">
                    Creating an account means you accept these Terms and our
                    Privacy Policy.
                  </p>
                </li>
                <li>
                  <strong>Use of The Service</strong>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>You must comply with local Indian laws</li>
                    <li>You are responsible for all content in your shop</li>
                    <li>No illegal or harmful products</li>
                  </ul>
                </li>
                <li>
                  <strong>Payments & Subscriptions</strong>
                  <p className="mt-1">
                    Subscriptions are prepaid and recurring.
                  </p>
                </li>
                <li>
                  <strong>Liability</strong>
                  <p className="mt-1">
                    We’re not liable for loss of business or revenue caused by
                    misuse or downtime beyond our control.
                  </p>
                </li>
              </ol>
            </TabsContent>

            {/* REFUND */}
            <TabsContent value="refund">
              <h2 className="mb-1 text-xl md:text-2xl font-bold text-white">
                Refund & Cancellation Policy
              </h2>
              <p className="mb-6 text-xs text-muted-foreground">
                Last updated: {new Date().getFullYear()}
              </p>

              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <strong>Subscriptions</strong>
                  <p className="mt-1">Renewals are non-refundable mid-cycle.</p>
                </li>
                <li>
                  <strong>Cancellation</strong>
                  <p className="mt-1">
                    Cancel anytime — plan stays active until period end.
                  </p>
                </li>
                <li>
                  <strong>Exceptional Refunds</strong>
                  <p className="mt-1">
                    Only for duplicate charges or BizoraPro system errors.
                  </p>
                </li>
                <li>
                  <strong>Contact</strong>
                  <p className="mt-1">
                    Write to{" "}
                    <Link
                      href="mailto:support@bizorapro.com"
                      className="text-primary underline"
                    >
                      support@bizorapro.com
                    </Link>
                  </p>
                </li>
              </ol>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </>
  );
}
