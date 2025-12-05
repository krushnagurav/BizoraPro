import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  // Fetch Payments with Shop Details
  const { data: payments } = await supabase
    .from("payments")
    .select("*, shops(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Transaction History</h1>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹0.00</div>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Shop Name</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Method</TableHead>
                <TableHead className="text-right text-gray-400">
                  Invoice
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-500"
                  >
                    No payments recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                payments?.map((pay) => (
                  <TableRow
                    key={pay.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-gray-300">
                      {new Date(pay.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {pay.shops?.name || "Unknown Shop"}
                    </TableCell>
                    <TableCell className="text-green-400 font-bold">
                      ₹{pay.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          pay.status === "succeeded"
                            ? "text-green-400 border-green-400"
                            : "text-red-400 border-red-400"
                        }
                      >
                        {pay.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="uppercase text-xs text-gray-400">
                      {pay.payment_method}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-white hover:bg-white/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
