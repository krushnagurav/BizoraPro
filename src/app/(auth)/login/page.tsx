// src\app\(auth)\login\page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/src/actions/auth-actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await loginAction(formData);

      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      }
      // on success the server action should redirect or return success
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#111] border-white/10 shadow-2xl shadow-black">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl text-white">Welcome Back 👋</CardTitle>
        <CardDescription className="text-gray-400">Log In to manage your shop</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" aria-describedby="login-help">
          <div className="space-y-2">
            <Label className="text-gray-300" htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
              aria-label="Email Address"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300" htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50 pr-10"
                aria-label="Password"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 mt-2"
            disabled={loading}
            aria-live="polite"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log In"}
          </Button>
        </form>

        <div id="login-help" className="mt-6 text-center space-y-4">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>

          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-bold">Create Shop</Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}