import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-foreground">
      
      {/* -------------------------------------------------------------------------- */
      /* HERO SECTION                                */
      /* -------------------------------------------------------------------------- */}
      <section className="container px-6 py-24 md:px-12 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-[#1A1A1A] text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-white/10">
          Our Story
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">
          Empowering Every Shop in <br/>
          <span className="text-primary">Bharat</span> to Go Online.
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          BizoraPro was built with a simple mission: To help the local Kirana, the home baker, 
          and the fashion boutique compete with the giants.
        </p>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* VALUES GRID                                 */
      /* -------------------------------------------------------------------------- */}
      <section className="bg-[#0A0A0A] py-24 border-y border-white/5">
        <div className="container px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Heart, 
                title: "Sellers First", 
                text: "We don't charge commissions. Your hard-earned money stays with you. Our success depends entirely on your growth." 
              },
              { 
                icon: MapPin, 
                title: "Made in India", 
                text: "Headquartered in Surat, Gujarat. We understand the unique challenges of the Indian market and build specifically for it." 
              },
              { 
                icon: TrendingUp, 
                title: "Simplicity", 
                text: "No coding. No complex setups. If you can use WhatsApp, you can use BizoraPro. We keep it simple so you can focus on selling." 
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* FOUNDER NOTE                                */
      /* -------------------------------------------------------------------------- */}
      <section className="container px-6 py-24 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-16 bg-[#111] border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex-1 space-y-8 relative z-10">
            <h2 className="text-3xl font-bold text-primary">A Note from the Founder</h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                "I saw my local shopkeepers struggling to manage orders on WhatsApp. 
                Sending 50 photos to every customer was painful. I knew there had to be a better way."
              </p>
              <p>
                "BizoraPro is the tool I wish my friends had. It's not just software; 
                it's a digital upgrade for your business identity."
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="font-bold text-white text-lg">Krishna Gurav</p>
              <p className="text-sm text-primary">Founder, BizoraPro</p>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center relative z-10">
             <div className="w-64 h-64 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-white/10 shadow-2xl shadow-black/50">
                <Users className="w-24 h-24 text-white/10" />
             </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* BOTTOM CTA                                  */
      /* -------------------------------------------------------------------------- */}
      <section className="container px-6 py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">Join the Revolution</h2>
        <Link href="/signup">
          <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20">
            Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

    </div>
  );
}