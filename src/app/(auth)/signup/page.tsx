"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signupAction } from "@/src/actions/auth-actions";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signupAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#111] border-white/10 shadow-2xl shadow-black relative overflow-hidden">
      {/* Decorative Glow at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary" />
      
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary text-black rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <Zap className="h-6 w-6 fill-black" />
        </div>
        <CardTitle className="text-2xl text-white">Start Your Free Shop 🚀</CardTitle>
        <CardDescription className="text-gray-400">
          No credit card required. 14-day trial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label className="text-gray-300">Full Name</Label>
            <Input 
              name="fullName" 
              placeholder="Raj Kumar" 
              required 
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Email Address</Label>
            <Input 
              name="email" 
              placeholder="you@example.com" 
              type="email" 
              required 
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Password</Label>
            <Input 
              name="password" 
              type="password" 
              placeholder="Min 8 chars" 
              required 
              minLength={6}
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
            />
          </div>
          
          <Button 
            className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 mt-4" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By continuing, you agree to our <Link href="/legal" className="underline hover:text-primary">Terms</Link> and <Link href="/legal" className="underline hover:text-primary">Privacy Policy</Link>.
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            Already have a shop?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Login
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}