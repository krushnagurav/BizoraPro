"use client";

import { useState, useEffect } from "react";
import { updateNotificationPrefsAction } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, BellRing, Mail, MessageCircle } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function NotificationSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState<any>({
    email_order: true,
    email_low_stock: true,
    whatsapp_order: true,
    marketing_updates: false
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("shops").select("notification_preferences").eq("owner_id", user.id).single();
        if (data?.notification_preferences) {
          setPrefs(data.notification_preferences);
        }
      }
    };
    fetchPrefs();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await updateNotificationPrefsAction(formData);
    setLoading(false);
    
    if (result?.error) toast.error(result.error);
    else toast.success("Preferences saved!");
  };

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <BellRing className="h-8 w-8" /> Notifications
        </h1>
        <p className="text-muted-foreground">Choose what alerts you want to receive.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Email Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Order Received</Label>
                <p className="text-xs text-muted-foreground">Get an email when a customer places an order.</p>
              </div>
              {/* Native Checkbox for Server Action simplicity */}
              <input type="checkbox" name="email_order" defaultChecked={prefs.email_order} className="h-5 w-5 accent-primary" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Warning</Label>
                <p className="text-xs text-muted-foreground">Alert when a product falls below 5 units.</p>
              </div>
              <input type="checkbox" name="email_low_stock" defaultChecked={prefs.email_low_stock} className="h-5 w-5 accent-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" /> WhatsApp Alerts
            </CardTitle>
            <CardDescription>Powered by Interakt (Coming Soon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between opacity-50">
              <div className="space-y-0.5">
                <Label>New Order (WhatsApp)</Label>
                <p className="text-xs text-muted-foreground">Receive order details on your WhatsApp.</p>
              </div>
              <input type="checkbox" name="whatsapp_order" defaultChecked={prefs.whatsapp_order} disabled className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="font-bold" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Preferences"}
        </Button>
      </form>
    </div>
  );
}