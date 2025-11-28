import { MobileHeader } from "@/src/components/dashboard/mobile-header";
import { Sidebar } from "@/src/components/dashboard/sidebar";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Check User & Shop Status
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 2. Fetch Shop to check Step
  const { data: shop } = await supabase
    .from("shops")
    .select("onboarding_step")
    .eq("owner_id", user.id)
    .single();

  // 🚨 SECURITY CHECK:
  // If shop doesn&apos;t exist OR onboarding is not done (step < 4)
  // KICK THEM OUT to Onboarding
  if (!shop || shop.onboarding_step < 4) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content Area */}
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}