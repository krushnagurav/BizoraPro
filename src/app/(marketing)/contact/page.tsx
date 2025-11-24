import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            We're here to support your business growth
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT COLUMN: Info Cards */}
          <div className="space-y-6">
            {/* WhatsApp Card */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-muted-foreground">
                    Fastest support response
                  </p>
                </div>
              </div>
              <Button className="w-fit bg-primary text-black font-bold hover:bg-primary/90">
                <MessageCircle className="w-4 h-4 mr-2" /> Message Us
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Mon-Sat, 10 AM – 7 PM IST
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Email Us</h3>
                  <p className="text-primary">support@bizorapro.com</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We reply within a few hours
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground pl-2">
              <span>🇮🇳</span> Based in Surat, Gujarat
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-10">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Full Name *
                  </label>
                  <Input
                    className="bg-[#0A0A0A] border-white/10 h-12"
                    placeholder=""
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Business Name
                  </label>
                  <Input
                    className="bg-[#0A0A0A] border-white/10 h-12"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Phone / WhatsApp *
                  </label>
                  <Input
                    className="bg-[#0A0A0A] border-white/10 h-12"
                    placeholder=""
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Email Address *
                  </label>
                  <Input
                    className="bg-[#0A0A0A] border-white/10 h-12"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Message *
                </label>
                <Textarea
                  className="bg-[#0A0A0A] border-white/10 min-h-[150px] resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button className="w-full h-14 text-lg font-bold bg-primary text-black hover:bg-primary/90">
                Send Message
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                We'll reach out shortly on WhatsApp or Email
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}