import Link from "next/link";
import { Store } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Background Accents (The "Triangles") */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
      </div>

      {/* Centered Card Wrapper */}
      <div className="w-full max-w-md z-10 p-4">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary mb-2 hover:opacity-80 transition">
             <Store className="w-6 h-6" />
             Bizora<span className="text-white">Pro</span>
           </Link>
           <p className="text-muted-foreground text-sm">Shop Owner Dashboard</p>
        </div>
        
        {children}

        <div className="mt-8 text-center text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} BizoraPro. All rights reserved.
        </div>
      </div>

    </div>
  );
}