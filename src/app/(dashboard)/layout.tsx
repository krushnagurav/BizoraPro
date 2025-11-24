import { MobileHeader } from "@/src/components/dashboard/mobile-header";
import { Sidebar } from "@/src/components/dashboard/sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header (Visible only on small screens) */}
      <MobileHeader />

      {/* Main Content Area */}
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}