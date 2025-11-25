import { Button } from "@/components/ui/button";
import { Shirt, Utensils, Scissors, Laptop, ShoppingCart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExamplesPage() {
  const filters = [
    { name: "All Designs", icon: Sparkles, active: true },
    { name: "Fashion", icon: Shirt, active: false },
    { name: "Bakery", icon: Utensils, active: false },
    { name: "Salon", icon: Scissors, active: false },
    { name: "Electronics", icon: Laptop, active: false },
    { name: "Grocery", icon: ShoppingCart, active: false },
  ];

  const shops = [
    {
      title: "Fashion Boutique",
      desc: "Elegant clothing store with product catalog and cart",
      tags: ["Add-to-Cart", "WhatsApp Orders"],
      imageColor: "bg-[#1E1E1E]", // Placeholder for image
      category: "Fashion"
    },
    {
      title: "Bakery Bliss",
      desc: "Fresh baked goods with daily specials and ordering",
      tags: ["Add-to-Cart", "WhatsApp Orders"],
      imageColor: "bg-[#1E1E1E]",
      category: "Bakery"
    },
    {
      title: "Groom & Glam Salon",
      desc: "Professional salon services with appointment booking",
      tags: ["Add-to-Cart", "WhatsApp Orders"],
      imageColor: "bg-[#1E1E1E]",
      category: "Salon"
    },
    {
      title: "TechElectro",
      desc: "Latest gadgets and electronics with detailed specs",
      tags: ["Add-to-Cart", "WhatsApp Orders"],
      imageColor: "bg-[#1E1E1E]",
      category: "Electronics"
    },
    {
      title: "FreshGrocer",
      desc: "Daily essentials and fresh produce delivery service",
      tags: ["Add-to-Cart", "WhatsApp Orders"],
      imageColor: "bg-[#1E1E1E]",
      category: "Grocery"
    },
    {
      title: "BeautyBliss",
      desc: "Premium cosmetics and skincare products collection",
      tags: ["Add-to-Cart", "WhatsApp Orders"],
      imageColor: "bg-[#1E1E1E]",
      category: "Beauty"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* HEADER */}
      <div className="pt-32 pb-20 text-center container px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          See How Different Businesses <br/>
          <span className="text-primary">Use BizoraPro</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Choose a design that fits your brand perfectly
        </p>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-center gap-4">
          {filters.map((f, i) => (
            <button 
              key={i}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                f.active 
                  ? "bg-primary text-black hover:bg-primary/90" 
                  : "bg-[#111] border border-white/10 text-muted-foreground hover:text-white hover:border-white/30"
              }`}
            >
              <f.icon className="w-4 h-4" />
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* SHOP GRID */}
      <div className="container px-6 md:px-12 mb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops.map((shop, i) => (
            <div key={i} className="group bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all">
              {/* Image Area */}
              <div className={`aspect-[4/3] ${shop.imageColor} relative border-b border-white/5`}>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded border border-white/10 text-primary">
                  Mobile Ready
                </div>
                {/* Placeholder for Screenshot */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-3/4 h-3/4 bg-white/10 rounded-lg transform rotate-2" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{shop.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{shop.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {shop.tags.map((tag, t) => (
                    <span key={t} className="px-3 py-1 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary hover:text-black transition-all font-bold">
                  Open Demo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUSTED BY (Testimonials) */}
      <div className="bg-[#0A0A0A] py-20 border-y border-white/5">
        <div className="container px-6 md:px-12 text-center">
          <p className="text-muted-foreground mb-12 uppercase tracking-widest text-xs">Trusted by small business owners in India</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "BizoraPro transformed my fashion store!", name: "Priya Sharma", role: "Fashion Boutique" },
              { text: "Easy setup and my sales doubled!", name: "Rahul Verma", role: "Electronics Hub" },
              { text: "Perfect for my bakery business!", name: "Anjali Mehta", role: "Home Baker" }
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-4 text-left p-4">
                <div className="w-12 h-12 rounded-full bg-white/10 shrink-0" /> {/* Avatar Placeholder */}
                <div>
                  <p className="text-sm font-medium text-white mb-1">"{t.text}"</p>
                  <p className="text-xs text-muted-foreground">- {t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="container px-6 md:px-12 text-center py-32">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Launch your shop today — <span className="text-primary">7 days free</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-10">
          No credit card required. Start selling in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary text-black hover:bg-primary/90">
              Create Shop Link <ArrowRight className="ml-2 w-5 h-5"/>
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-white/20 hover:bg-white/10">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}