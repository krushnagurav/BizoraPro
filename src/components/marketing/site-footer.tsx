// src/components/marketing/site-footer.tsx
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-14 pb-8 text-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              className="mb-4 block text-2xl font-bold text-primary hover:opacity-90 transition-opacity"
            >
              Bizora<span className="text-white">Pro</span>
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium mini-websites for WhatsApp businesses. Built for Indian
              sellers who want to look serious and trustworthy.
            </p>
          </div>

          {/* Product Column */}
          <nav aria-label="Product links">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Product
            </h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link
                  href="/features"
                  className="hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/examples"
                  className="hover:text-primary transition-colors"
                >
                  Examples
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company Column */}
          <nav aria-label="Company links">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Company
            </h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="hover:text-primary transition-colors"
                >
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support Column */}
          <nav aria-label="Support links">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Support
            </h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Support
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Email Us
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="text-xs md:text-sm">
            © {year} BizoraPro. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-xs opacity-80">
            Made with <span className="text-red-500">♥</span> in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}