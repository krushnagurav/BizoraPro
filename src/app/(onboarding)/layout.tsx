// src/app/(onboarding)/layout.tsx
import Link from "next/link";
import { Store } from "lucide-react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center pt-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
      </div>

      {/* Simple Header */}
      <div className="z-10 mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-2xl text-primary hover:opacity-80 transition"
        >
          <Store className="w-6 h-6" />
          Bizora<span className="text-white">Pro</span>
        </Link>
      </div>

      {/* The Wizard Content */}
      <div className="w-full max-w-lg z-10 px-4">{children}</div>
    </div>
  );
}
