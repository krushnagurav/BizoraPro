"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { updateProfileAction, updatePasswordAction } from "@/src/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, User, Lock } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-primary">Profile Settings</h1>

      {/* 1. PERSONAL INFO */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Details
          </CardTitle>
          <CardDescription>Manage your account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            setLoading(true);
            const res = await updateProfileAction(formData);
            setLoading(false);
            if (res?.error) toast.error(res.error);
            else toast.success(res.success);
          }} className="space-y-4">
            
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="fullName" defaultValue={user.user_metadata.full_name} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input name="email" defaultValue={user.email} />
              <p className="text-[10px] text-muted-foreground">Changing email requires re-verification.</p>
            </div>

            <Button disabled={loading} className="font-bold">
              {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. SECURITY */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Security
          </CardTitle>
          <CardDescription>Update your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            setLoading(true);
            const res = await updatePasswordAction(formData);
            setLoading(false);
            if (res?.error) toast.error(res.error);
            else toast.success("Password updated successfully");
          }} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input name="password" type="password" placeholder="••••••" minLength={6} />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input name="confirmPassword" type="password" placeholder="••••••" minLength={6} />
              </div>
            </div>

            <Button variant="outline" disabled={loading}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}