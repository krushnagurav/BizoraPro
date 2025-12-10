// src/app/(super-admin)/layout.tsx
/*
 * Super Admin Layout
 * This layout is specifically for super administrator pages.
 * It includes authentication checks to ensure only the designated
 * super admin can access these routes, along with the necessary
 * UI components like sidebar and mobile header.
 */
import { AdminMobileHeader } from "@/src/components/admin/admin-mobile-header";
import { AdminSidebar } from "@/src/components/admin/admin-sidebar";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "krishna@bizorapro.com";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <AdminSidebar />

      <AdminMobileHeader />

      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen p-4 md:p-8 bg-black">
        {children}
      </main>
    </div>
  );
}
