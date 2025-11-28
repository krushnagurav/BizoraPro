"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { forgotPasswordAction } from "@/src/actions/auth-actions";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await forgotPasswordAction(formData);

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Reset link sent! Check your inbox.");
    }
  };

  return (
    <Card className="bg-[#111] border-white/10 shadow-2xl shadow-black">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary text-black rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <KeyRound className="h-6 w-6 fill-black" />
        </div>
        <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
        <CardDescription className="text-gray-400">
          Enter your email and we&apos;ll send you a secure link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
            <Input 
              name="email" 
              id="email" 
              placeholder="you@example.com" 
              type="email" 
              required 
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
            />
          </div>
          
          <Button 
            className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <Link 
            href="/login" 
            className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}