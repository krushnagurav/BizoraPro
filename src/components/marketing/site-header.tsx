import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container flex h-20 items-center justify-between px-6 md:px-12">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary hover:opacity-90">
          Bizora<span className="text-foreground">Pro</span>
        </Link>
        
        {/* DESKTOP NAV (Hidden on Mobile) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/examples" className="hover:text-primary transition-colors">Examples</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Support</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>
        
        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:text-primary">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="font-bold">Create Shop</Button>
          </Link>
        </div>

        {/* MOBILE MENU (Visible only on Mobile) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border text-foreground">
              <div className="flex flex-col gap-6 mt-10">
                <Link href="/features" className="text-lg font-medium hover:text-primary">Features</Link>
                <Link href="/pricing" className="text-lg font-medium hover:text-primary">Pricing</Link>
                <Link href="/examples" className="text-lg font-medium hover:text-primary">Examples</Link>
                <Link href="/contact" className="text-lg font-medium hover:text-primary">Support</Link>
                <Link href="/about" className="text-lg font-medium hover:text-primary">About</Link>
                <hr className="border-border" />
                <Link href="/login" className="text-lg font-medium hover:text-primary">Login</Link>
                <Link href="/signup">
                  <Button className="w-full font-bold">Create Shop</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}