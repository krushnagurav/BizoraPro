// src\app\(auth)\forgot-password\page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/src/actions/auth-actions";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const result = await forgotPasswordAction(formData);
      setLoading(false);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Reset link sent! Check your inbox.");
      }
    } catch {
      setLoading(false);
      toast.error("Unable to send reset link. Try again.");
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
          Enter your email and we'll send a secure reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
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
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Log In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}