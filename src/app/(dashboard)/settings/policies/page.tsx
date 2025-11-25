"use client";

import { useState, useEffect } from "react";
import { updateStorePoliciesAction } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function PoliciesPage() {
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState({ privacy: "", terms: "", refund: "" });

  useEffect(() => {
    const fetchPolicies = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("shops").select("policies").eq("owner_id", user.id).single();
        if (data?.policies) {
          setPolicies(data.policies as any);
        }
      }
    };
    fetchPolicies();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await updateStorePoliciesAction(formData);
    setLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Policies saved!");
  };

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
        <ShieldCheck className="w-8 h-8" /> Store Policies
      </h1>
      <p className="text-muted-foreground">Define the rules for your shop to build trust.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Refund & Cancellation Policy</CardTitle>
            <CardDescription>Explain when and how customers can return items.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              name="refund" 
              defaultValue={policies.refund} 
              className="min-h-[150px]" 
              placeholder="e.g., No returns on discounted items. Exchange within 7 days..."
            />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <CardDescription>General rules for using your shop.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              name="terms" 
              defaultValue={policies.terms} 
              className="min-h-[150px]" 
              placeholder="e.g., We reserve the right to cancel orders..."
            />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>How you handle customer data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              name="privacy" 
              defaultValue={policies.privacy} 
              className="min-h-[150px]" 
              placeholder="e.g., We only use your phone number for order updates..."
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" className="font-bold" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Policies"}
          </Button>
        </div>

      </form>
    </div>
  );
}