// src/app/(dashboard)/layout.tsx
/*
 * Dashboard Layout
 * This layout component is used for the dashboard section of the application.
 * It includes authentication checks and ensures that only authorized users
 * can access the dashboard features.
 */
import React from "react";
import { MobileHeader } from "@/src/components/dashboard/mobile-header";
import { Sidebar } from "@/src/components/dashboard/sidebar";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("onboarding_step")
    .eq("owner_id", user.id)
    .single();

  if (!shop || shop.onboarding_step < 4) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <MobileHeader />

      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen">{children}</main>
    </div>
  );
}
