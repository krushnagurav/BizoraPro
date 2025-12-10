// src/components/dashboard/billing/invoice-list.tsx
/*  * Invoice List Component
 * This component displays a list
 * of invoices in the billing
 * section of the dashboard,
 * allowing users to view and
 * download their invoice history.
 */
"use client";

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
import { Button } from "@/components/ui/button";
import { Download, Eye, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InvoiceList({ invoices }: { invoices: any[] }) {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Invoice History</CardTitle>

        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-[120px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Filter className="h-3 w-3" /> Filter
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No invoices found. Upgrade to Pro to see billing history.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="border-border hover:bg-secondary/10"
                >
                  <TableCell className="font-mono font-medium">
                    #INV-{inv.id.slice(0, 6).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-purple-500/10 text-purple-500 border-purple-500/20"
                    >
                      Pro Business
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">₹{inv.amount}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        inv.status === "succeeded"
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          : inv.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      }
                    >
                      {inv.status === "succeeded" ? "Paid" : inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:text-primary"
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
  );
}
