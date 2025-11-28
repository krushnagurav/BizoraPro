"use client";

import { useState } from "react";
import { updatePasswordAction } from "@/src/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LockKeyhole } from "lucide-react";

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
    // Success will redirect automatically via Server Action
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
            <Label htmlFor="password" class="text-gray-300">New Password</Label>
            <Input 
              name="password" 
              type="password" 
              placeholder="••••••" 
              required 
              minLength={6}
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" class="text-gray-300">Confirm Password</Label>
            <Input 
              name="confirmPassword" 
              type="password" 
              placeholder="••••••" 
              required 
              minLength={6}
              className="bg-[#050505] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
            />
          </div>
          
          <Button 
            className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 mt-2" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}