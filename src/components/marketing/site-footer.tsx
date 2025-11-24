import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-black border-t border-border/20 py-12 text-sm">
      <div className="container px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="font-bold text-primary mb-4">BizoraPro</h4>
          <p className="text-muted-foreground">Premium websites for WhatsApp businesses.</p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Product</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/features" className="hover:text-primary">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link href="/examples" className="hover:text-primary">Examples</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/legal" className="hover:text-primary">Terms & Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/contact" className="hover:text-primary">WhatsApp Support</Link></li>
            <li><a href="mailto:support@bizorapro.com" className="hover:text-primary">Email Us</a></li>
          </ul>
        </div>
      </div>
      <div className="container px-6 md:px-12 text-center text-muted-foreground border-t border-border/20 pt-8">
        © 2025 BizoraPro. All rights reserved.
      </div>
    </footer>
  );
}