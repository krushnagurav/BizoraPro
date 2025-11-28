// src/app/(marketing)/contact/page.tsx
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto">
          Fast support for your business — on WhatsApp or email
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Options */}
          <div className="space-y-7">
            {/* WhatsApp */}
            <div className="rounded-2xl border border-white/10 bg-[#111] p-8 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="border border-primary/20 bg-primary/10 p-3 rounded-xl">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    WhatsApp Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fastest replies during working hours
                  </p>
                </div>
              </div>

              <Button className="mt-6 font-bold bg-primary text-black hover:bg-primary/90 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Message Us
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Mon–Sat, 10 AM – 7 PM IST
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-white/10 bg-[#111] p-8 hover:border-white/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="border border-white/10 bg-white/5 p-3 rounded-xl">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Email Support
                  </h3>
                  <p className="text-primary text-sm font-medium">
                    support@bizorapro.com
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We respond within a few hours
                  </p>
                </div>
              </div>
            </div>

            <p className="flex items-center gap-2 text-muted-foreground pl-2 text-sm">
              🇮🇳 Based in Surat, Gujarat
            </p>
          </div>

          {/* Form */}
          {/* <form
            className="rounded-2xl border border-white/10 bg-[#111] p-8 md:p-10 space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-white"
                  htmlFor="name"
                >
                  Full Name *
                </label>
                <Input id="name" className="h-12 bg-black/40 border-white/10" />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-white"
                  htmlFor="business"
                >
                  Business Name
                </label>
                <Input
                  id="business"
                  className="h-12 bg-black/40 border-white/10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-white"
                  htmlFor="phone"
                >
                  Phone / WhatsApp *
                </label>
                <Input
                  id="phone"
                  className="h-12 bg-black/40 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-white"
                  htmlFor="email"
                >
                  Email Address *
                </label>
                <Input
                  id="email"
                  className="h-12 bg-black/40 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-white"
                htmlFor="message"
              >
                Message *
              </label>
              <Textarea
                id="message"
                className="min-h-[140px] resize-none bg-black/40 border-white/10"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <Button className="w-full h-14 text-base md:text-lg font-bold bg-primary text-black hover:bg-primary/90">
              Send Message
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              We’ll reach out on WhatsApp or Email
            </p>
          </form> */}
        </div>
      </section>
    </>
  );
}