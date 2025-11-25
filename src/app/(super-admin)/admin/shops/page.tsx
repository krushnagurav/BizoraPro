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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Ban } from "lucide-react";
import { toggleShopStatusAction } from "@/src/actions/admin-actions";
import Link from "next/link";
import { ImpersonateButton } from "@/src/components/admin/impersonate-button";

export default async function AdminShopsPage() {
  const supabase = await createClient();

  // Fetch all shops with owner email (if joined) or just shops
  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">All Shops</h1>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Shop Name</TableHead>
                <TableHead className="text-gray-400">URL Slug</TableHead>
                <TableHead className="text-gray-400">Plan</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shops?.map((shop) => (
                <TableRow
                  key={shop.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/shops/${shop.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {shop.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-blue-400">
                    <a
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/${shop.slug}`}
                      target="_blank"
                    >
                      /{shop.slug}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-primary text-primary capitalize"
                    >
                      {shop.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        shop.is_open
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }
                    >
                      {shop.is_open ? "Active" : "Closed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Visit Button */}
                      <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/${shop.slug}`}
                        target="_blank"
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-white/10 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </a>

                      <div className="scale-75 origin-right">
                        {" "}
                        {/* Scale down to fit in table */}
                        <ImpersonateButton userId={shop.owner_id} />
                      </div>

                      {/* Suspend Button (Form) */}
                      <form action={toggleShopStatusAction}>
                        <input type="hidden" name="shopId" value={shop.id} />
                        <input
                          type="hidden"
                          name="currentStatus"
                          value={String(!shop.is_open)}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
