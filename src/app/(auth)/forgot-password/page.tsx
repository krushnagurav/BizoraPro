"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { forgotPasswordAction } from "@/src/actions/auth-actions";

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
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a secure link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              name="email" 
              id="email" 
              placeholder="you@example.com" 
              type="email" 
              required 
            />
          </div>
          
          <Button className="w-full font-bold" size="lg" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-primary flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}