import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp, 
  Tag, 
  MessageCircle, 
  Smartphone, 
  Palette, 
  Edit, 
  QrCode, 
  ShieldCheck 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">

      {/* -------------------------------------------------------------------------- */
      /* HERO                                     */
      /* -------------------------------------------------------------------------- */}
      <section className="container px-6 py-20 md:py-32 md:px-12 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            A Premium <br />
            Website for Your <br />
            <span className="text-primary">WhatsApp <br /> Business</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            Showcase products beautifully. Get direct orders on WhatsApp. 
            Turn your chat into a professional storefront in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-14 font-bold">
                Start Free
              </Button>
            </Link>
            <Link href="#samples">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 h-14">
                View Sample Shop
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Hero Image Placeholder */}
        <div className="flex-1 w-full">
          <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-tr from-secondary to-card rounded-3xl border border-border/50 overflow-hidden shadow-2xl flex items-center justify-center">
             {/* Replace this div with an <Image /> tag when you have the phone mockup */}
             <div className="text-center p-8">
                <Smartphone className="w-32 h-32 text-primary/20 mx-auto mb-4" />
                <p className="text-muted-foreground">Phone Mockup Image</p>
             </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* VALUE PROPS                                  */
      /* -------------------------------------------------------------------------- */}
      <section className="bg-secondary/20 py-20">
        <div className="container px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, title: "Boost Trust & Sales", text: "Professional appearance increases customer confidence." },
            { icon: Tag, title: "Catalog with Prices", text: "Display products clearly with transparent pricing." },
            { icon: MessageCircle, title: "Direct WhatsApp Orders", text: "Seamless ordering through WhatsApp chat." },
            { icon: Smartphone, title: "No GST / No App", text: "Simple solution without complications." }
          ].map((feature, i) => (
            <Card key={i} className="bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <feature.icon className="w-10 h-10 text-primary mx-auto" />
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* SAMPLE SHOPS                                 */
      /* -------------------------------------------------------------------------- */}
      <section id="samples" className="container px-6 py-24 md:px-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Sample <span className="text-primary">Shops</span></h2>
        <p className="text-muted-foreground mb-16">See how different businesses use BizoraPro</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Boutique", desc: "Luxury fashion store with premium styling" },
            { title: "Bakery", desc: "Sweet treats with warm, inviting design" },
            { title: "Salon", desc: "Modern beauty services with clean aesthetics" }
          ].map((shop, i) => (
            <div key={i} className="group rounded-xl border border-border/50 bg-card overflow-hidden text-left hover:border-primary/50 transition-all">
              <div className="aspect-[16/10] bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Shop Preview Image</span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-xl">{shop.title}</h3>
                <p className="text-sm text-muted-foreground">{shop.desc}</p>
                <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-black transition-colors">
                  Open Demo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* PREMIUM FEATURES                                */
      /* -------------------------------------------------------------------------- */}
      <section id="features" className="bg-secondary/10 py-24">
        <div className="container px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Premium <span className="text-primary">Features</span></h2>
            <p className="text-muted-foreground">Everything you need for a professional online presence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Palette, title: "Premium Themes", text: "Beautiful, professionally designed templates." },
              { icon: MessageCircle, title: "WhatsApp Orders", text: "Direct integration with WhatsApp Business." },
              { icon: Edit, title: "Update Anytime", text: "Easy content management and updates." },
              { icon: QrCode, title: "QR Code for Shop", text: "Easy sharing with QR code generation." },
              { icon: Smartphone, title: "Mobile-First Design", text: "Optimized for mobile viewing experience." },
              { icon: ShieldCheck, title: "Secure Hosting", text: "Reliable and secure hosting infrastructure." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl bg-card border border-border/50 hover:bg-secondary/40 transition-colors">
                <div className="shrink-0">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* PRICING                                    */
      /* -------------------------------------------------------------------------- */}
      <section id="pricing" className="container px-6 py-24 md:px-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple <span className="text-primary">Pricing</span></h2>
        <p className="text-muted-foreground mb-16">Choose the plan that works for you</p>

        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card className="flex-1 bg-card border-border/50 relative overflow-hidden">
            <CardContent className="p-8 md:p-12 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-2">Free Starter</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Perfect for trying it out</p>
              </div>
              <div className="mt-auto">
                <Link href="/signup">
                  <Button className="w-full h-12 font-bold text-lg">Get Started</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Plan (Highlighted) */}
          <Card className="flex-1 bg-card border-primary relative overflow-hidden shadow-lg shadow-primary/10">
            <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>
            <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
              Best Value
            </div>
            <CardContent className="p-8 md:p-12 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-2">Pro Business</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">₹199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Save 17% with annual billing</p>
              </div>
              <div className="mt-auto">
                <Link href="/signup">
                  <Button className="w-full h-12 font-bold text-lg">Get Started</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <div className="inline-block bg-primary text-black font-bold px-8 py-4 rounded-md text-lg">
            ⚠️ No Hidden Fees. Cancel Anytime.
          </div>
        </div>
      </section>

    </div>
  );
}