import Link from "next/link";

export function SiteFooter() {
  return (
    // Changed border-border/20 to border-white/10 for sharper contrast on black
    <footer className="bg-black border-t border-white/10 py-16 text-sm">
      <div className="container px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        
        {/* Brand Column */}
        <div>
          <Link href="/" className="font-bold text-2xl text-primary mb-4 block hover:opacity-90 transition-opacity">
            Bizora<span className="text-white">Pro</span>
          </Link>
          <p className="text-muted-foreground leading-relaxed max-w-[200px]">
            Premium websites for WhatsApp businesses. Built for scale.
          </p>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="font-bold text-white mb-6">Product</h4>
          <ul className="space-y-4 text-muted-foreground">
            <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link href="/examples" className="hover:text-primary transition-colors">Examples</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="font-bold text-white mb-6">Company</h4>
          <ul className="space-y-4 text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/legal" className="hover:text-primary transition-colors">Terms & Privacy</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="font-bold text-white mb-6">Support</h4>
          <ul className="space-y-4 text-muted-foreground">
            <li><Link href="/contact" className="hover:text-primary transition-colors">WhatsApp Support</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Email Us</Link></li>
            <li><Link href="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
        <p>© {new Date().getFullYear()} BizoraPro. All rights reserved.</p>
        
        {/* The Trust Signal */}
        <p className="flex items-center gap-2 text-xs opacity-80">
          Made with <span className="text-red-500">♥</span> in India 🇮🇳
        </p>
      </div>
    </footer>
  );
}