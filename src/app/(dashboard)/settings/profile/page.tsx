"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction, updateProfileAction } from "@/src/actions/auth-actions";
import { createClient } from "@/src/lib/supabase/client";
import { Loader2, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingProfile(true);
    const formData = new FormData(event.currentTarget);
    
    const result = await updateProfileAction(formData);
    setLoadingProfile(false);
    
    if (result?.error) toast.error(result.error);
    else toast.success("Profile updated successfully!");
  };

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingPassword(true);
    const formData = new FormData(event.currentTarget);
    
    const result = await updatePasswordAction(formData);
    setLoadingPassword(false);
    
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Password updated!");
      (event.target as HTMLFormElement).reset();
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          Profile Settings
        </h1>
      </div>

      {/* PERSONAL DETAILS */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
             <User className="h-5 w-5 text-primary" /> Personal Details
          </CardTitle>
          <CardDescription>Manage your account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
             <div className="space-y-2">
               <Label>Full Name</Label>
               <Input 
                 name="fullName" 
                 defaultValue={user.user_metadata.full_name} 
                 className="bg-background border-border" 
               />
             </div>
             <div className="space-y-2">
               <Label>Email Address</Label>
               <Input 
                 name="email" 
                 defaultValue={user.email} 
                 disabled 
                 className="bg-secondary/20 border-border text-muted-foreground cursor-not-allowed" 
               />
               <p className="text-xs text-muted-foreground">Changing email requires re-verification.</p>
             </div>
             <Button disabled={loadingProfile} className="font-bold bg-primary text-black hover:bg-primary/90">
               {loadingProfile ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
             </Button>
          </form>
        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
             <Lock className="h-5 w-5 text-primary" /> Security
          </CardTitle>
          <CardDescription>Update your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
             <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>New Password</Label>
                 <Input 
                   name="password" 
                   type="password" 
                   placeholder="••••••" 
                   minLength={6}
                   className="bg-background border-border" 
                   required 
                 />
               </div>
               <div className="space-y-2">
                 <Label>Confirm Password</Label>
                 <Input 
                   name="confirmPassword" 
                   type="password" 
                   placeholder="••••••" 
                   minLength={6}
                   className="bg-background border-border" 
                   required 
                 />
               </div>
             </div>
             <Button variant="outline" disabled={loadingPassword} className="border-border hover:bg-secondary/20">
               {loadingPassword ? <Loader2 className="animate-spin mr-2" /> : "Update Password"}
             </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}