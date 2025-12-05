"use client";

import { useState, useEffect } from "react";
import { updateNotificationPrefsAction } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  BellRing,
  Mail,
  MessageCircle,
  Package,
  AlertTriangle,
  Megaphone,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

export default function NotificationSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState<any>({
    email_order: true,
    email_low_stock: true,
    whatsapp_order: false, // Default off
    marketing_updates: false,
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("shops")
          .select("notification_preferences")
          .eq("owner_id", user.id)
          .single();
        if (data?.notification_preferences) {
          setPrefs(data.notification_preferences);
        }
      }
    };
    fetchPrefs();
  }, []);

  const handleToggle = (key: string, value: boolean) => {
    setPrefs((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    // Convert boolean state to formData entries manually
    Object.keys(prefs).forEach((key) => {
      if (prefs[key]) formData.append(key, "on");
    });

    const result = await updateNotificationPrefsAction(formData);
    setLoading(false);

    if (result?.error) toast.error(result.error);
    else toast.success("Preferences saved!");
  };

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <BellRing className="h-8 w-8" /> Notifications
        </h1>
        <p className="text-muted-foreground">
          Control how and when we contact you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* EMAIL ALERTS */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-blue-500" /> Email Notifications
            </CardTitle>
            <CardDescription>
              Receive updates directly to your registered email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/10 transition">
              <div className="flex gap-3 items-start">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-0.5">
                  <Label className="text-base">New Order Received</Label>
                  <p className="text-xs text-muted-foreground">
                    Get an email immediately when a customer places an order.
                  </p>
                </div>
              </div>
              <Switch
                checked={prefs.email_order}
                onCheckedChange={(v) => handleToggle("email_order", v)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/10 transition">
              <div className="flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-0.5">
                  <Label className="text-base">Low Stock Warning</Label>
                  <p className="text-xs text-muted-foreground">
                    Alert when a product inventory drops below 5 units.
                  </p>
                </div>
              </div>
              <Switch
                checked={prefs.email_low_stock}
                onCheckedChange={(v) => handleToggle("email_low_stock", v)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/10 transition">
              <div className="flex gap-3 items-start">
                <Megaphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-0.5">
                  <Label className="text-base">Platform Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    News about new features and improvements.
                  </p>
                </div>
              </div>
              <Switch
                checked={prefs.marketing_updates}
                onCheckedChange={(v) => handleToggle("marketing_updates", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* WHATSAPP ALERTS (Premium) */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-green-500" /> WhatsApp
              Alerts
            </CardTitle>
            <CardDescription>Get instant alerts on your phone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between opacity-60 p-3 rounded-lg border border-dashed border-border/50">
              <div className="space-y-0.5">
                <Label className="text-base">New Order (WhatsApp)</Label>
                <p className="text-xs text-muted-foreground">
                  Receive full order details on your WhatsApp number.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase font-bold">
                  Coming Soon
                </span>
                <Switch disabled checked={false} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            size="lg"
            className="font-bold bg-primary text-black hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
