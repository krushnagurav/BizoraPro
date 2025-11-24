import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-5xl text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Simple Pricing</h1>
        <p className="text-muted-foreground text-xl">Start for free. Upgrade when you grow.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* FREE PLAN */}
        <Card className="border-border/50 bg-card/50 relative">
          <CardHeader>
            <CardTitle className="text-2xl">Free Starter</CardTitle>
            <CardDescription>Perfect for new sellers</CardDescription>
            <div className="my-4">
              <span className="text-5xl font-bold">₹0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-left text-sm">
              <li className="flex items-center gap-2"><Check className="text-primary h-4 w-4"/> 10 Products</li>
              <li className="flex items-center gap-2"><Check className="text-primary h-4 w-4"/> WhatsApp Checkout</li>
              <li className="flex items-center gap-2"><Check className="text-primary h-4 w-4"/> Basic Analytics</li>
              <li className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4"/> Custom Domain</li>
            </ul>
            <Button variant="outline" className="w-full mt-6" size="lg">Start Free</Button>
          </CardContent>
        </Card>

        {/* PRO PLAN */}
        <Card className="border-primary bg-card relative shadow-lg shadow-primary/10">
          <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Pro Business</CardTitle>
            <CardDescription>For serious shops</CardDescription>
            <div className="my-4">
              <span className="text-5xl font-bold">₹199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-left text-sm">
              <li className="flex items-center gap-2"><Check className="text-primary h-4 w-4"/> Unlimited Products</li>
              <li className="flex items-center gap-2"><Check className="text-primary h-4 w-4"/> Priority Support</li>
              <li className="flex items-center gap-2"><Check className="text-primary h-4 w-4"/> Remove Branding</li>
              <li className="flex items-center gap-2"><Check className="text-primary h-4 w-4"/> Revenue Reports</li>
            </ul>
            <Button className="w-full mt-6 font-bold" size="lg">Get Pro</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}