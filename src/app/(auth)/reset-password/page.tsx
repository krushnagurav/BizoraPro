// src\app\(auth)\reset-password\page.tsx
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
import { updatePasswordAction } from "@/src/actions/auth-actions";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
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
      const result = await updatePasswordAction(formData);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      }
      // success flow handled by server action
    } catch {
      toast.error("Unable to update password. Try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#111] border-white/10 shadow-2xl shadow-black">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary text-black rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <LockKeyhole className="h-6 w-6 fill-black" />
        </div>
        <CardTitle className="text-2xl text-white">Set New Password</CardTitle>
        <CardDescription className="text-gray-400">
          Create a strong password to secure your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="••••••••"
                className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50 pr-10"
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
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                minLength={8}
                placeholder="••••••••"
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
            className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 mt-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}