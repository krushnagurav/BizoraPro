"use client";

import { useState, useEffect } from "react";
import { updateCustomDomainAction } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Globe, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

export default function DomainSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("");
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    const fetchShop = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("shops").select("custom_domain, domain_verified, plan").eq("owner_id", user.id).single();
        setShop(data);
        if (data?.custom_domain) setDomain(data.custom_domain);
      }
    };
    fetchShop();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Check Plan (Only Pro can add domain)
    // Note: With 15-day trial logic, we will allow this if trial is active.
    // For now, let&apos;s assume everyone can try.
    
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await updateCustomDomainAction(formData);
    setLoading(false);
    
    if (result?.error) toast.error(result.error);
    else toast.success(result.success);
  };

  if (!shop) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Globe className="h-8 w-8" /> Custom Domain
        </h1>
        <p className="text-muted-foreground">Connect your own domain (e.g., mystore.com) to your shop.</p>
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Connect Domain</CardTitle>
          <CardDescription>
             Enter the domain you bought from GoDaddy, Namecheap, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label>Your Domain</Label>
              <div className="flex gap-2">
                <Input 
                  name="domain" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com" 
                  className="font-mono"
                />
                <Button disabled={loading} className="font-bold">
                  {loading ? <Loader2 className="animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>

            {/* DNS Instructions (Only verify if domain is saved) */}
            {shop.custom_domain && (
              <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 space-y-4">
                <div className="flex items-center gap-2">
                   <span className="font-bold text-sm">Status:</span>
                   {shop.domain_verified ? (
                     <Badge className="bg-green-500 text-white gap-1"><CheckCircle2 className="w-3 h-3"/> Live</Badge>
                   ) : (
                     <Badge variant="outline" className="border-yellow-500 text-yellow-500 gap-1"><AlertCircle className="w-3 h-3"/> Pending DNS</Badge>
                   )}
                </div>
                
                {!shop.domain_verified && (
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>To go live, add this record to your DNS provider:</p>
                    <div className="bg-black p-3 rounded-lg font-mono text-xs text-white flex justify-between items-center">
                      <span>Type: A <br/> Name: @ <br/> Value: 76.76.21.21</span>
                    </div>
                    <p className="text-xs">It may take up to 24 hours to propagate.</p>
                  </div>
                )}
              </div>
            )}

          </form>
        </CardContent>
      </Card>
    </div>
  );
}