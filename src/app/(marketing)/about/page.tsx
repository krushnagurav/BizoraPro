import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Users, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* 1. Hero Section */}
      <section className="container px-6 py-24 md:px-12 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-secondary/50 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/20">
          Our Story
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          Empowering Every Shop in <br/>
          <span className="text-primary">Bharat</span> to Go Online.
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          BizoraPro was built with a simple mission: To help the local Kirana, the home baker, 
          and the fashion boutique compete with the giants. We believe technology should be 
          easy, affordable, and accessible to everyone.
        </p>
      </section>

      {/* 2. The Values Grid */}
      <section className="bg-secondary/10 py-20">
        <div className="container px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border/50 p-6">
              <CardContent className="space-y-4 pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Sellers First</h3>
                <p className="text-muted-foreground">
                  We don't charge commissions. Your hard-earned money stays with you. 
                  Our success depends entirely on your growth.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 p-6">
              <CardContent className="space-y-4 pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Made in India</h3>
                <p className="text-muted-foreground">
                  Headquartered in Surat, Gujarat. We understand the unique challenges 
                  of the Indian market and build specifically for it.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 p-6">
              <CardContent className="space-y-4 pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Simplicity</h3>
                <p className="text-muted-foreground">
                  No coding. No complex setups. If you can use WhatsApp, you can use BizoraPro. 
                  We keep it simple so you can focus on selling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Founder / Team Note (Optional - adds personal touch) */}
      <section className="container px-6 py-24 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-card border border-border/50 rounded-3xl p-8 md:p-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-primary">A Note from the Founder</h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                I saw my local shopkeepers struggling to manage orders on WhatsApp. 
                Sending 50 photos to every customer was painful. I knew there had to be a better way.
              </p>
              <p>
                BizoraPro is the tool I wish my friends had. It's not just software; 
                it's a digital upgrade for your business identity.
              </p>
            </div>
            <div className="pt-4">
              <p className="font-bold text-foreground">Krishna Gurav</p>
              <p className="text-sm text-muted-foreground">Founder, BizoraPro</p>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
             {/* Placeholder for Founder Image or Abstract Graphic */}
             <div className="w-64 h-64 bg-secondary rounded-full flex items-center justify-center border-2 border-primary/20">
                <Users className="w-24 h-24 text-muted-foreground/50" />
             </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="container px-6 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Join the Revolution</h2>
        <Link href="/signup">
          <Button size="lg" className="h-14 px-10 text-lg font-bold">Start Your Journey</Button>
        </Link>
      </section>

    </div>
  );
}