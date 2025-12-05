import { AdminSidebar } from "@/src/components/admin/admin-sidebar";
import { AdminMobileHeader } from "@/src/components/admin/admin-mobile-header";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Header */}
      <AdminMobileHeader />

      {/* Content */}
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
