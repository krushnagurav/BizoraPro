import { AdminSidebar } from "@/src/components/admin/admin-sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="md:pl-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}