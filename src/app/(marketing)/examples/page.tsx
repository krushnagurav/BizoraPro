import { Button } from "@/components/ui/button";

export default function ExamplesPage() {
  return (
    <div className="py-24 container px-6 md:px-12 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Sample <span className="text-primary">Shops</span></h1>
      <p className="text-xl text-muted-foreground mb-16">See what's possible with BizoraPro.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Fashion Boutique", type: "Clothing" },
          { title: "Urban Bakery", type: "Food" },
          { title: "Tech Gadgets", type: "Electronics" }
        ].map((shop, i) => (
          <div key={i} className="group rounded-xl border border-border/50 bg-card overflow-hidden text-left hover:border-primary/50 transition-all">
            <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Preview Image</span>
            </div>
            <div className="p-6">
              <div className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">{shop.type}</div>
              <h3 className="font-bold text-2xl mb-4">{shop.title}</h3>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-black transition-colors">
                Visit Live Shop
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}