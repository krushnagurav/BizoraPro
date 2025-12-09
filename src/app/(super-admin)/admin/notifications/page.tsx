import { NotificationCenter } from "@/src/components/admin/notifications/notification-center";
import { createClient } from "@/src/lib/supabase/server";
import { BellRing } from "lucide-react";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();

  // Fetch unique recent history (Group by title/message to avoid 1000 duplicates)
  // For MVP: Just fetch last 50 notifications to ANY user to show "what was sent"
  const { data: history } = await supabase
    .from("notifications")
    .select("id, title, message, type, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  // Deduplicate by title manually for display purposes (optional)
  const uniqueHistory =
    history?.filter(
      (v, i, a) => a.findIndex((v2) => v2.title === v.title) === i,
    ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <BellRing className="h-8 w-8 text-primary" /> Notification Center
        </h1>
        <p className="text-gray-400">Manage and monitor system-wide alerts.</p>
      </div>

      <NotificationCenter history={uniqueHistory} />
    </div>
  );
}
