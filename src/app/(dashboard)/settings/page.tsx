"use client";

import { useState, useEffect } from "react";
import { updateShopSettingsAction } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    const fetchShop = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("shops").select("*").eq("owner_id", user.id).single();
        setShop(data);
      }
    };
    fetchShop();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await updateShopSettingsAction(formData);
    setLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Settings saved!");
  };

  if (!shop) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-primary">General Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Status */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Store Status</CardTitle>
            <CardDescription>Turn off your store when you are on vacation.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
             <input 
               type="checkbox" 
               name="isOpen" 
               defaultChecked={shop.is_open} 
               className="h-5 w-5 accent-primary"
             />
             <span className="text-sm">Online (Accepting Orders)</span>
          </CardContent>
        </Card>

        {/* Order Rules */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Order Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Minimum Order Value (₹)</Label>
              <Input name="minOrder" type="number" defaultValue={shop.min_order_value} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Delivery Note</Label>
              <Textarea name="deliveryNote" defaultValue={shop.delivery_note} placeholder="Delivery charges..." />
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="font-bold" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Save General Settings"}
        </Button>
      </form>
    </div>
  );
}