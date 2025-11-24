"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LockKeyhole } from "lucide-react";
import { updatePasswordAction } from "@/src/actions/auth-actions";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updatePasswordAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
    // Success will redirect automatically
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <LockKeyhole className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Set New Password</CardTitle>
        <CardDescription>
          Create a strong password to secure your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input 
              name="password" 
              type="password" 
              placeholder="••••••" 
              required 
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              name="confirmPassword" 
              type="password" 
              placeholder="••••••" 
              required 
              minLength={6}
            />
          </div>
          
          <Button className="w-full font-bold" size="lg" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}