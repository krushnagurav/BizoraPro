// src/components/admin/recent-shops-table.tsx
/*  * Recent Shops Table Component
 * This component displays a table
 * of recently signed-up shops
 * in the admin dashboard,
 * showing key details like
 * shop name, plan, and status.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";

export function RecentShopsTable({ shops }: { shops: any[] }) {
  return (
    <Card className="bg-[#111] border-white/10 text-white h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Signups</CardTitle>
        <Link href="/admin/shops">
          <Button variant="link" className="text-[#E6B800] p-0 h-auto text-sm">
            View All <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="text-gray-400">Shop Name</TableHead>
              <TableHead className="text-gray-400">Plan</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop) => (
              <TableRow
                key={shop.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-[#E6B800]">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{shop.name}</p>
                      <p className="text-[10px] text-gray-500">/{shop.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize border-white/20 ${shop.plan === "pro" ? "text-[#E6B800]" : "text-gray-400"}`}
                  >
                    {shop.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div
                    className={`w-2 h-2 rounded-full ${shop.is_open ? "bg-green-500" : "bg-red-500"}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
