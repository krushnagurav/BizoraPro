"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { removeCustomDomainAction, updateCustomDomainAction } from "@/src/actions/shop-actions";
import { createClient } from "@/src/lib/supabase/client";
import { AlertCircle, CheckCircle2, Copy, Globe, Loader2, Lock, RefreshCw, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DomainSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [shop, setShop] = useState<any>(null);

  // 1. Fetch Shop Logic
  useEffect(() => {
    const fetchShop = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("shops").select("custom_domain, domain_verified, plan, slug").eq("owner_id", user.id).single();
        setShop(data);
        if (data?.custom_domain) setDomainInput(data.custom_domain);
      }
    };
    fetchShop();
  }, []);

  // 2. Handlers
  const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateCustomDomainAction(formData);
    setLoading(false);
    
    if (res?.error) toast.error(res.error);
    else {
      toast.success(res.success);
      window.location.reload(); // Reload to show DNS instructions
    }
  };

  const handleRemove = async () => {
    if(!confirm("Are you sure? Your custom domain will stop working.")) return;
    setLoading(true);
    const res = await removeCustomDomainAction();
    setLoading(false);
    
    if (res?.error) toast.error(res.error);
    else {
      toast.success(res.success);
      setShop({ ...shop, custom_domain: null, domain_verified: false });
      setDomainInput("");
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    // Simulate verification check (In V2, call Vercel API)
    setTimeout(() => {
       setVerifying(false);
       if(shop.domain_verified) toast.success("Domain is live!");
       else toast.warning("DNS not propagated yet. Try again in 30 mins.");
    }, 2000);
  };

  if (!shop) return <div className="p-8">Loading...</div>;

  const isPro = shop.plan === 'pro';

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Globe className="h-8 w-8" /> Custom Domain
        </h1>
        <p className="text-muted-foreground">Connect your own domain (e.g., mystore.com) to establish your brand.</p>
      </div>

      {/* 🔒 GATEKEEPER: FREE PLAN */}
      {!isPro && (
        <Card className="bg-secondary/10 border-dashed border-yellow-500/50">
           <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                 <Lock className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unlock Custom Domains</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                 Connect your own domain to build trust and look professional. Available exclusively on the <strong>Pro Plan</strong>.
              </p>
              <Link href="/billing">
                <Button className="bg-[#E6B800] text-black font-bold hover:bg-[#FFD700] gap-2">
                   <Zap className="w-4 h-4" /> Upgrade to Pro
                </Button>
              </Link>
           </CardContent>
        </Card>
      )}

      {/* ✅ ACTIVE DOMAIN DASHBOARD */}
      {isPro && shop.custom_domain && (
        <Card className="bg-card border-border/50">
           <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex justify-between items-center">
                 <CardTitle>Domain Status</CardTitle>
                 {shop.domain_verified ? (
                    <Badge className="bg-green-500 text-white gap-1 hover:bg-green-600"><CheckCircle2 className="w-3 h-3"/> Live</Badge>
                 ) : (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500 gap-1 animate-pulse"><AlertCircle className="w-3 h-3"/> Pending DNS</Badge>
                 )}
              </div>
           </CardHeader>
           <CardContent className="pt-6 space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/50">
                 <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-primary" />
                    <div>
                       <p className="font-bold text-lg">{shop.custom_domain}</p>
                       <p className="text-xs text-muted-foreground">Primary Store URL</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleVerify} disabled={verifying}>
                       {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleRemove} disabled={loading}>
                       <Trash2 className="w-4 h-4" />
                    </Button>
                 </div>
              </div>

              {!shop.domain_verified && (
                 <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                       <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> DNS Configuration Required
                       </h4>
                       <p className="text-sm text-muted-foreground mb-4">
                          Log in to your domain provider (GoDaddy, Namecheap, etc.) and add the following record:
                       </p>
                       
                       <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="p-3 bg-background border border-border rounded">
                             <p className="text-xs text-muted-foreground mb-1">Type</p>
                             <p className="font-mono font-bold">A</p>
                          </div>
                          <div className="p-3 bg-background border border-border rounded">
                             <p className="text-xs text-muted-foreground mb-1">Name (Host)</p>
                             <p className="font-mono font-bold">@</p>
                          </div>
                          <div className="p-3 bg-background border border-border rounded">
                             <p className="text-xs text-muted-foreground mb-1">Value</p>
                             <p className="font-mono font-bold flex justify-between">
                                76.76.21.21
                                <Copy className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => {navigator.clipboard.writeText("76.76.21.21"); toast.success("Copied")}}/>
                             </p>
                          </div>
                       </div>
                       <p className="text-xs text-muted-foreground mt-3">
                          Note: DNS changes can take up to 24 hours to propagate.
                       </p>
                    </div>
                 </div>
              )}
           </CardContent>
        </Card>
      )}

      {/* ➕ CONNECT FORM (Only if no domain) */}
      {isPro && !shop.custom_domain && (
        <Card className="bg-card border-border/50">
           <CardHeader>
             <CardTitle>Connect New Domain</CardTitle>
             <CardDescription>Enter the domain you want to use for your shop.</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleConnect} className="flex gap-3">
                <Input 
                   name="domain" 
                   placeholder="example.com" 
                   className="h-11 font-mono bg-background border-border"
                   required 
                />
                <Button type="submit" className="h-11 font-bold" disabled={loading}>
                   {loading ? <Loader2 className="animate-spin" /> : "Connect Domain"}
                </Button>
             </form>
           </CardContent>
        </Card>
      )}
      
      {/* Fallback Link */}
      <div className="text-center text-sm text-muted-foreground">
         Your store is always accessible at: <span className="text-foreground">bizorapro.com/{shop.slug}</span>
      </div>

    </div>
  );
}