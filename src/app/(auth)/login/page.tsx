"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner"; // For error popups
import { Loader2 } from "lucide-react";
import { loginAction } from "@/src/actions/auth-actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      toast.error(result.error); // Show error message
      setLoading(false);
    }
    // If success, the server action redirects automatically.
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-xl text-center">Welcome Back 👋</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" id="email" placeholder="you@example.com" type="email" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Forgot?
              </Link>
            </div>
            <Input name="password" id="password" type="password" required />
          </div>
          
          <Button className="w-full font-bold" size="lg" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Create Shop
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}