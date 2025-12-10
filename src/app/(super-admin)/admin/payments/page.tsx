// src/app/(super-admin)/admin/payments/page.tsx
/*
 * Admin Payments Page
 *
 * This page displays a list of subscription payments made by shops.
 * Super administrators can view transaction details, filter by status, and export payment records.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentToolbar } from "@/src/components/admin/payments/payment-toolbar";
import { createClient } from "@/src/lib/supabase/server";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const queryText = params.q || "";
  const statusFilter = params.status || "all";
  const page = Number(params.page) || 1;
  const itemsPerPage = 20;

  const supabase = await createClient();

  const { data: revenueData } = await supabase
    .from("payments")
    .select("amount, status");
  const totalRevenue =
    revenueData
      ?.filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const failedCount =
    revenueData?.filter((p) => p.status === "failed").length || 0;
  const successCount =
    revenueData?.filter((p) => p.status === "succeeded").length || 0;

  let query = supabase
    .from("payments")
    .select("*, shops(name)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") query = query.eq("status", statusFilter);
  if (queryText) query = query.ilike("id", `${queryText}%`);

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  const { data: payments, count } = await query.range(from, to);

  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Transaction History</h1>
        <p className="text-gray-400">
          View and manage all subscription payments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="text-green-500"
        />
        <StatsCard
          title="Successful Payments"
          value={successCount}
          icon={CheckCircle2}
          color="text-blue-500"
        />
        <StatsCard
          title="Failed / Pending"
          value={failedCount}
          icon={AlertCircle}
          color="text-red-500"
        />
      </div>

      <PaymentToolbar />

      <Card className="bg-[#111] border-white/10 text-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10 bg-white/5">
                <TableHead className="text-gray-300">Transaction ID</TableHead>
                <TableHead className="text-gray-300">Shop Name</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-right text-gray-300">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-gray-500"
                  >
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                payments?.map((pay) => (
                  <TableRow
                    key={pay.id}
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-gray-400">
                      #{pay.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {pay.shops?.name || "Unknown Shop"}
                    </TableCell>
                    <TableCell className="text-green-400 font-bold">
                      ₹{pay.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize border ${
                          pay.status === "succeeded"
                            ? "border-green-500 text-green-500 bg-green-500/10"
                            : pay.status === "pending"
                              ? "border-yellow-500 text-yellow-500 bg-yellow-500/10"
                              : "border-red-500 text-red-500 bg-red-500/10"
                        }`}
                      >
                        {pay.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {new Date(pay.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/payments/${pay.id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:text-white hover:bg-white/10 h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:text-primary hover:bg-white/10 h-8 w-8"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Link
            href={`/admin/payments?page=${page > 1 ? page - 1 : 1}&q=${queryText}&status=${statusFilter}`}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              className="border-white/10 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
          </Link>
          <span className="flex items-center text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/payments?page=${page < totalPages ? page + 1 : totalPages}&q=${queryText}&status=${statusFilter}`}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="bg-[#111] border-white/10 text-white">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-white/5 ${color} bg-opacity-10`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
