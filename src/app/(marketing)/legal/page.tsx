import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LegalPage() {
  return (
    <main className="bg-background text-foreground pb-20 pt-24">
      <section className="container mx-auto max-w-4xl px-6 md:px-12">
        {/* Header */}
        <header className="mb-10 text-center space-y-3">
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
          <TabsList className="grid w-full grid-cols-3 bg-secondary/20 border border-border/40 rounded-xl p-1">
            <TabsTrigger value="privacy" className="text-xs md:text-sm py-2">
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="text-xs md:text-sm py-2">
              Terms of Service
            </TabsTrigger>
            <TabsTrigger value="refund" className="text-xs md:text-sm py-2">
              Refund Policy
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 rounded-2xl border border-border bg-card/80 p-6 md:p-8 text-sm md:text-base text-muted-foreground space-y-8">
            {/* PRIVACY */}
            <TabsContent value="privacy" className="space-y-6">
              <div>
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-foreground">
                  Privacy Policy
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Last updated: {new Date().getFullYear()}
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  1. Introduction
                </h3>
                <p>
                  BizoraPro (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;)
                  provides tools for shop owners to create a mini-website and
                  manage WhatsApp-based orders. This Privacy Policy explains how
                  we collect, use, and protect your information when you use our
                  platform.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  2. Information We Collect
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-medium text-foreground">
                      Account data:
                    </span>{" "}
                    Name, email, phone, business details.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Shop data:
                    </span>{" "}
                    Shop name, slug, product details, pricing, images and
                    policies.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Usage data:
                    </span>{" "}
                    Page views, events and anonymised analytics (excluding shop
                    owner views on their own shop).
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  3. How We Use Your Data
                </h3>
                <p>We use your data to:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Provide and improve the BizoraPro service.</li>
                  <li>Operate your shop pages and dashboard.</li>
                  <li>
                    Send important notifications about your account and billing.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  4. Data Sharing
                </h3>
                <p>
                  We do not sell your personal data. We may share limited data
                  with trusted third-party service providers (e.g. hosting,
                  analytics, payment gateways) only as necessary to operate the
                  platform.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  5. Your Rights
                </h3>
                <p>
                  You can request access, correction or deletion of your
                  personal data by contacting us at{" "}
                  <span className="text-primary font-medium">
                    support@bizorapro.com
                  </span>
                  .
                </p>
              </section>
            </TabsContent>

            {/* TERMS */}
            <TabsContent value="terms" className="space-y-6">
              <div>
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-foreground">
                  Terms of Service
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Last updated: {new Date().getFullYear()}
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By creating an account or using BizoraPro, you agree to these
                  Terms of Service and our Privacy Policy. If you do not agree,
                  please do not use the platform.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  2. Use of the Service
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    You are responsible for the content you publish on your
                    shop.
                  </li>
                  <li>
                    You must comply with local laws, including any tax,
                    invoicing and consumer protection rules.
                  </li>
                  <li>
                    You may not use BizoraPro for illegal, misleading or harmful
                    activities.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  3. Payments & Subscriptions
                </h3>
                <p>
                  Paid plans are billed in advance (monthly or yearly). By
                  subscribing, you authorise us or our payment provider to
                  charge the applicable fees.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  4. Limitation of Liability
                </h3>
                <p>
                  BizoraPro is provided on an &quot;as is&quot; basis. To the
                  maximum extent permitted by law, we are not liable for any
                  loss of revenue, data or business arising from your use of the
                  platform.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  5. Changes to Terms
                </h3>
                <p>
                  We may update these Terms from time to time. Continued use of
                  the service after changes means you accept the updated Terms.
                </p>
              </section>
            </TabsContent>

            {/* REFUND */}
            <TabsContent value="refund" className="space-y-6">
              <div>
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-foreground">
                  Refund & Cancellation Policy
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Last updated: {new Date().getFullYear()}
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  1. Subscriptions
                </h3>
                <p>
                  BizoraPro works on a subscription basis. Fees paid for monthly
                  or yearly plans are generally non-refundable once a billing
                  period has started.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  2. Cancellations
                </h3>
                <p>
                  You can cancel your subscription at any time from your
                  dashboard. Your plan will remain active until the end of the
                  current billing period. After that, your shop may move to
                  &quot;catalog mode&quot; or a free tier with limited features.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  3. Exceptional Refunds
                </h3>
                <p>
                  In rare cases (duplicate payments, technical issues on our
                  side), we may review refund requests manually. Please contact{" "}
                  <span className="text-primary font-medium">
                    support@bizorapro.com
                  </span>{" "}
                  within 7 days of the charge.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  4. Contact
                </h3>
                <p>
                  For any questions about refunds or cancellations, please email
                  us at{" "}
                  <span className="text-primary font-medium">
                    support@bizorapro.com
                  </span>
                  .
                </p>
              </section>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </main>
  );
}