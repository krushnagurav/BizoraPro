// src/components/dashboard/marketing/export-leads-btn.tsx
/*  * Export Leads Button Component
 * This component provides a button
 * to export marketing leads as a CSV
 * file from the marketing dashboard.
 */
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function ExportLeadsButton({ data }: { data: any[] }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("No leads to export");
      return;
    }

    const headers = ["Name", "Phone", "Date"];

    const rows = data.map((lead) => [
      lead.name || "Guest",
      lead.phone,
      new Date(lead.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "marketing_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Leads exported successfully!");
  };

  return (
    <Button variant="outline" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" /> Export CSV
    </Button>
  );
}
