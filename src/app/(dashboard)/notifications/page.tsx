import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Info,
  AlertTriangle,
  CheckCircle2,
  Megaphone,
} from "lucide-react";
import { MarkAllReadBtn } from "@/src/components/dashboard/notifications/mark-read-btn";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  // Helper to get icon
  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "announcement":
        return <Megaphone className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Bell className="h-8 w-8" /> Inbox
          </h1>
          <p className="text-muted-foreground">
            Updates, announcements, and alerts.
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadBtn />}
      </div>

      <div className="space-y-4">
        {notifications?.length === 0 ? (
          <div className="text-center py-20 bg-secondary/10 rounded-xl border border-dashed border-border/50">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-muted-foreground">
              All caught up!
            </h3>
            <p className="text-sm text-muted-foreground/50">
              You have no new notifications.
            </p>
          </div>
        ) : (
          notifications?.map((n) => (
            <Card
              key={n.id}
              className={`border-border/50 transition-all ${!n.is_read ? "bg-secondary/20 border-primary/30" : "bg-card opacity-80"}`}
            >
              <CardContent className="p-4 flex gap-4 items-start">
                <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4
                      className={`text-sm font-bold ${!n.is_read ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                  {n.type === "announcement" && (
                    <Badge
                      variant="secondary"
                      className="mt-2 text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                    >
                      New Feature
                    </Badge>
                  )}
                </div>
                {!n.is_read && (
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 shrink-0" />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
