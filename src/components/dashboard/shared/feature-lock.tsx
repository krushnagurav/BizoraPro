"use client";

import { Button } from "@/components/ui/button";
import { Lock, Zap } from "lucide-react";
import Link from "next/link";

export function FeatureLock({ 
  plan, 
  children, 
  featureName 
}: { 
  plan: string | undefined, 
  children: React.ReactNode, 
  featureName: string 
}) {
  // If PRO, show the real feature
  // We treat 'undefined' as 'free' for safety
  if (plan === 'pro') {
    return <>{children}</>;
  }

  // If FREE, show the Lock Screen
  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50">
      {/* The Content (Blurred) */}
      <div className="filter blur-sm opacity-20 pointer-events-none select-none p-4" aria-hidden="true">
        {children}
      </div>

      {/* The Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-background/10 backdrop-blur-[2px]">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20 shadow-lg shadow-primary/5">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Unlock {featureName}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
          This is a <strong>Pro Feature</strong>. Upgrade your plan to access advanced analytics, unlimited products, and more.
        </p>
        <Link href="/billing">
          <Button size="lg" className="bg-primary text-black font-bold hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
            <Zap className="w-4 h-4" /> Upgrade to Pro
          </Button>
        </Link>
      </div>
    </div>
  );
}