import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Filter } from "lucide-react";
import Link from "next/link";

export default async function AdminInvoicesPage() {
  const supabase = await createClient();

  // Fetch Payments (treating them as Invoices)
  const { data: invoices } = await supabase
    .from("payments")
    .select("*, shops(name, owner_id, plan)")
    .order("created_at", { ascending: false });

  // Calculate Total Revenue (Mock logic for display)
  const totalRevenue =
    invoices?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Subscription Invoices
          </h1>
          <p className="text-gray-400">
            View and manage invoices across all shops.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-primary text-black font-bold hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <FileText className="h-6 w-6" />
              </div>
              <Badge className="bg-green-500/10 text-green-500">+8%</Badge>
            </div>
            <div className="text-3xl font-bold">{invoices?.length || 0}</div>
            <div className="text-sm text-gray-400">Total Invoices</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <FileText className="h-6 w-6" />
              </div>
              <Badge className="bg-green-500 text-black">Paid</Badge>
            </div>
            <div className="text-3xl font-bold">
              {invoices?.filter((i) => i.status === "succeeded").length || 0}
            </div>
            <div className="text-sm text-gray-400">Paid Invoices</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="text-xl font-bold">₹</span>
              </div>
            </div>
            <div className="text-3xl font-bold">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Invoice ID</TableHead>
                <TableHead className="text-gray-400">Shop</TableHead>
                <TableHead className="text-gray-400">Plan</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices?.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-mono text-xs text-primary">
                    INV-{inv.id.slice(0, 6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{inv.shops?.name}</div>
                    <div className="text-xs text-gray-500">
                      ID: {inv.shop_id.slice(0, 6)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-purple-500/50 text-purple-400 capitalize"
                    >
                      {inv.shops?.plan || "Free"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">₹{inv.amount}</TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        inv.status === "succeeded"
                          ? "bg-green-900 text-green-300 hover:bg-green-900"
                          : "bg-red-900 text-red-300 hover:bg-red-900"
                      }
                    >
                      {inv.status === "succeeded" ? "Paid" : inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/invoices/${inv.id}`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-white/10 text-gray-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-white/10 text-gray-400 hover:text-white"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {invoices?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-gray-500"
                  >
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
