import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MarkReadButton } from "@/src/components/dashboard/notifications/mark-read-btn";
import { createClient } from "@/src/lib/supabase/server";
import { Bell } from "lucide-react";

export default async function UserNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch Broadcasts (null) OR Personal (user.id)
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
        <Bell className="h-8 w-8" /> Inbox
      </h1>

      <div className="space-y-4">
        {notifications?.map((notif) => (
          <Card
            key={notif.id}
            className={`border-border/50 ${
              notif.is_read
                ? "bg-card opacity-60"
                : "bg-secondary/10 border-primary/30"
            }`}
          >
            <CardContent className="p-6 flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{notif.title}</h3>
                  {!notif.is_read && (
                    <Badge className="bg-primary text-black">New</Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {notif.type}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{notif.message}</p>
                <p className="text-xs text-muted-foreground/50 pt-2">
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </div>

              {!notif.is_read && <MarkReadButton id={notif.id} />}
            </CardContent>
          </Card>
        ))}

        {notifications?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No notifications.
          </div>
        )}
      </div>
    </div>
  );
}
