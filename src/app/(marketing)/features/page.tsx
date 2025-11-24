import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Edit,
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Store,
  LayoutDashboard,
  Globe,
  BarChart3,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* -------------------------------------------------------------------------- */
      /* HERO SECTION                                */
      /* -------------------------------------------------------------------------- */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

        <div className="container px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-white/10 text-xs font-medium text-primary mb-6">
            ✨ All Features
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Everything you need to grow your <br />
            <span className="text-primary">WhatsApp Business</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Beautiful storefront + Add-to-Cart + Direct WhatsApp orders. The
            complete toolkit for modern sellers.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-bold bg-primary text-black hover:bg-primary/90"
            >
              Create Shop Link <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* FEATURE GRID (6 CARDS)                          */
      /* -------------------------------------------------------------------------- */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Store,
                title: "Premium Storefront",
                text: "Beautiful product showcase that builds trust instantly.",
              },
              {
                icon: MessageCircle,
                title: "Add-to-Cart + WhatsApp",
                text: "Seamless cart to WhatsApp checkout flow.",
              },
              {
                icon: QrCode,
                title: "QR Code for Sharing",
                text: "Print and share your shop instantly.",
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                text: "Perfect on every smartphone screen.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Hosting",
                text: "Fast, reliable, and always online.",
              },
              {
                icon: Edit,
                title: "Manage Products",
                text: "Add, edit, delete products in seconds.",
              },
              {
                icon: BarChart3,
                title: "Business Analytics",
                text: "Track views, clicks, and engagement.",
              },
              {
                icon: Globe,
                title: "Custom Domain",
                text: "Use your own domain name (Premium).",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-xl bg-[#111] border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* SPOTLIGHT 1: STOREFRONT                          */
      /* -------------------------------------------------------------------------- */}
      <section className="py-32 bg-background">
        <div className="container px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="text-xs font-bold tracking-widest text-primary uppercase">
              Storefront
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Turn WhatsApp into a <br />
              <span className="text-primary">Real Online Store</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Professional product listing with prices, descriptions, and
              high-quality images. Your customers see everything before they
              message you.
            </p>
            <ul className="space-y-4">
              {[
                "Unlimited products with images and descriptions",
                "Categories to organize your catalog",
                "Looks professional on all devices",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            {/* Placeholder for Phone Mockup Image */}
            <div className="relative aspect-[4/3] bg-[#111] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center space-y-4 opacity-50">
                <Smartphone className="w-24 h-24 mx-auto text-white/20" />
                <p className="text-sm font-mono text-muted-foreground">
                  STORE UI MOCKUP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* SPOTLIGHT 2: ORDERING FLOW (Reversed)               */
      /* -------------------------------------------------------------------------- */}
      <section className="py-32 bg-[#050505]">
        <div className="container px-6 md:px-12 flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="text-xs font-bold tracking-widest text-primary uppercase">
              Ordering
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Seamless <span className="text-primary">WhatsApp Ordering</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Customers add products to cart, review their order, and send it
              directly to your WhatsApp with one tap. No complicated checkout
              forms.
            </p>
            <ul className="space-y-4">
              {[
                "Simple add-to-cart functionality",
                "Order summary sent to your WhatsApp",
                "Continue conversation for payment & delivery",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            {/* Placeholder for Cart UI Image */}
            <div className="relative aspect-[4/3] bg-[#111] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center space-y-4 opacity-50">
                <MessageCircle className="w-24 h-24 mx-auto text-white/20" />
                <p className="text-sm font-mono text-muted-foreground">
                  WHATSAPP FLOW MOCKUP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* SPOTLIGHT 3: MANAGEMENT                          */
      /* -------------------------------------------------------------------------- */}
      <section className="py-32 bg-background">
        <div className="container px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="text-xs font-bold tracking-widest text-primary uppercase">
              Management
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Manage your shop{" "}
              <span className="text-primary">from anywhere</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Update products, prices, and images in seconds. No technical
              skills needed. Just login and edit from any device.
            </p>
            <ul className="space-y-4">
              {[
                "Simple dashboard to manage everything",
                "Add products with photos instantly",
                "Changes go live immediately",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            {/* Placeholder for Dashboard UI Image */}
            <div className="relative aspect-[4/3] bg-[#111] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center space-y-4 opacity-50">
                <LayoutDashboard className="w-24 h-24 mx-auto text-white/20" />
                <p className="text-sm font-mono text-muted-foreground">
                  DASHBOARD UI MOCKUP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* CTA FOOTER                                  */
      /* -------------------------------------------------------------------------- */}
      <section className="py-32 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />

        <div className="container px-6 md:px-12 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Start Free — No GST. <br />
            <span className="text-primary">No App Required.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Create your WhatsApp shop in 5 minutes. No credit card needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-bold bg-primary text-black hover:bg-primary/90"
              >
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/examples">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 text-lg border-white/20 text-white hover:bg-white/10"
              >
                View Sample Shop
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground opacity-60 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Secure • No hidden charges •
            Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}