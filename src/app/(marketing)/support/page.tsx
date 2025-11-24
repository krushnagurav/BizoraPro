import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageCircle, 
  FileText, 
  Headphones, 
  Link as LinkIcon, 
  PlusCircle, 
  AlertTriangle, 
  ArrowUpCircle, 
  Key, 
  Globe, 
  Mail, 
} from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black text-foreground pb-20">
      
      {/* -------------------------------------------------------------------------- */
      /* HERO & SEARCH                               */
      /* -------------------------------------------------------------------------- */}
      <section className="pt-32 pb-20 container px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          How can we help you?
        </h1>
        <p className="text-xl text-muted-foreground mb-10">
          We're here to support your WhatsApp business
        </p>

        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search help articles..." 
            className="h-14 pl-12 bg-[#111] border-white/10 text-lg focus:border-primary/50 rounded-xl"
          />
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* MAIN SUPPORT CHANNELS (3 CARDS)                     */
      /* -------------------------------------------------------------------------- */}
      <section className="container px-6 md:px-12 mb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* WhatsApp Support */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center hover:border-green-500/30 transition-all group">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <MessageCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">WhatsApp Support</h3>
            <p className="text-sm text-muted-foreground mb-8">Chat with our team directly on WhatsApp</p>
            <Link href="https://wa.me/your-number">
              <Button className="w-full h-12 font-bold bg-green-600 hover:bg-green-700 text-white">
                Message Us
              </Button>
            </Link>
          </div>

          {/* Help Articles */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-all group">
            <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Help Articles</h3>
            <p className="text-sm text-muted-foreground mb-8">Guides to set up and manage your shop</p>
            <Button className="w-full h-12 font-bold bg-blue-600 hover:bg-blue-700 text-white">
              View Guides
            </Button>
          </div>

          {/* Contact Support */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/30 transition-all group">
            <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
              <Headphones className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Contact Support</h3>
            <p className="text-sm text-muted-foreground mb-8">Submit a ticket and get expert support</p>
            <Link href="/contact">
              <Button className="w-full h-12 font-bold bg-purple-600 hover:bg-purple-700 text-white">
                Send Request
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* POPULAR TOPICS                               */
      /* -------------------------------------------------------------------------- */}
      <section className="container px-6 md:px-12 mb-24 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 text-white">Popular Topics</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: LinkIcon, text: "How to create your shop link?", color: "text-yellow-500" },
            { icon: PlusCircle, text: "How to add products quickly?", color: "text-yellow-500" },
            { icon: AlertTriangle, text: "WhatsApp orders not received?", color: "text-yellow-500" },
            { icon: ArrowUpCircle, text: "How to upgrade plan?", color: "text-yellow-500" },
            { icon: Key, text: "Forgot password?", color: "text-yellow-500" },
            { icon: Globe, text: "Custom domain support?", color: "text-yellow-500" },
          ].map((topic, i) => (
            <div key={i} className="flex items-center gap-4 p-6 rounded-xl bg-[#111] border border-white/5 hover:border-white/20 cursor-pointer transition-all">
              <topic.icon className={`w-5 h-5 ${topic.color}`} />
              <span className="text-sm font-medium text-gray-300">{topic.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* NEED MORE HELP SECTION                           */
      /* -------------------------------------------------------------------------- */}
      <section className="container px-6 md:px-12 mb-24 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-12 text-white">Need more help?</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-8 rounded-xl bg-[#111] border border-white/10 hover:border-green-500/50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-bold text-white">WhatsApp Support</h3>
            <p className="text-sm text-muted-foreground">Fast replies</p>
          </div>

          <div className="p-8 rounded-xl bg-[#111] border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white">Email Support</h3>
            <p className="text-sm text-muted-foreground">support@bizorapro.com</p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#111] border border-white/5 flex flex-col items-center justify-center">
          <h4 className="font-bold text-white mb-1">Support Hours</h4>
          <p className="text-sm text-muted-foreground">Mon–Sat, 10 AM – 7 PM IST</p>
        </div>
        
        <p className="text-yellow-500 text-sm mt-6 font-medium">
          We respond within a few hours on business days
        </p>
      </section>

      {/* -------------------------------------------------------------------------- */
      /* BOTTOM CTA                                  */
      /* -------------------------------------------------------------------------- */}
      <div className="text-center pb-10">
        <Link href="/signup">
          <Button size="lg" className="h-12 px-8 font-bold text-black bg-primary hover:bg-primary/90 mb-6">
            Create Shop Link — Free
          </Button>
        </Link>
        <div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-white underline underline-offset-4">
            Back to Home
          </Link>
        </div>
      </div>

    </div>
  );
}