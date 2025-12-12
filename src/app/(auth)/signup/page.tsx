// src\app\(auth)\signup\page.tsx
/*
 * Signup Page
 * This component renders the signup page where new users can create an account.
 * It includes a form for entering user details and handles form submission.
 */
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
import { signupAction } from "@/src/actions/auth-actions";
import { Eye, EyeOff, Loader2, MailCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [verifyNeeded, setVerifyNeeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirmPassword") || "");

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await signupAction(formData);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      } else if (result?.success) {
        if (result.requireVerify) {
          setVerifyNeeded(true);
          setLoading(false);
        } else if (result.redirectUrl) {
          toast.success("Account created! Redirecting...");
          router.push(result.redirectUrl);
          router.refresh();
        }
      }
    } catch {
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  if (verifyNeeded) {
    return (
      <Card className="bg-[#111] border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-green-500" />
        <CardContent className="pt-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <MailCheck className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Verification Required
          </h2>
          <p className="text-gray-400">
            It seems email verification is enabled.
            <br />
            Please check your email or disable it in Supabase.
          </p>
          <div className="pt-6">
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full border-white/10 text-white hover:bg-white/10"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111] border-white/10 shadow-2xl shadow-black relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary" />
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary text-black rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <Zap className="h-6 w-6 fill-black" />
        </div>
        <CardTitle className="text-2xl text-white">
          Create Your Free Shop 🚀
        </CardTitle>
        <CardDescription className="text-gray-400">
          No credit card required. Instant Access.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-describedby="signup-help"
        >
          <div className="space-y-2">
            <Label className="text-gray-300" htmlFor="fullName">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              required
              placeholder="Your name"
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300" htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300" htmlFor="password">
              Password (Minimum 8 Characters)
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Secure password"
                className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50 pr-10"
                aria-describedby="password-help"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                minLength={8}
                placeholder="Confirm password"
                className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={
                  showConfirm
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 mt-4"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>

          <p
            id="signup-help"
            className="text-xs text-center text-gray-500 mt-4"
          >
            By continuing, you agree to our{" "}
            <Link href="/legal" className="underline hover:text-primary">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            Already have a shop?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-bold"
            >
              Log In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
