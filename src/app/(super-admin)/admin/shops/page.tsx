// src/app/(super-admin)/admin/shops/page.tsx
/*  * Admin Shops Page
 *
 * This page displays a list of shops registered on the platform.
 * Super administrators can view shop details, filter by status and plan,
 * and perform actions like impersonation and status toggling.
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
import { toggleShopStatusAction } from "@/src/actions/admin-actions";
import { ImpersonateButton } from "@/src/components/admin/impersonate-button";
import { ShopsTableToolbar } from "@/src/components/admin/shops/shops-table-toolbar";
import { createClient } from "@/src/lib/supabase/server";
import {
  AlertOctagon,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";

export default async function AdminShopsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    plan?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const queryText = params.q || "";
  const statusFilter = params.status || "all";
  const planFilter = params.plan || "all";
  const page = Number(params.page) || 1;
  const itemsPerPage = 10;

  const supabase = await createClient();

  let query = supabase.from("shops").select("*", { count: "exact" });

  if (queryText) query = query.ilike("name", `%${queryText}%`);
  if (statusFilter !== "all") {
    if (statusFilter === "active") query = query.eq("is_open", true);
    if (statusFilter === "closed") query = query.eq("is_open", false);
  }
  if (planFilter !== "all") query = query.eq("plan", planFilter);

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data: shops, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const { count: totalShops } = await supabase
    .from("shops")
    .select("id", { count: "exact", head: true });
  const { count: activeCount } = await supabase
    .from("shops")
    .select("id", { count: "exact", head: true })
    .eq("is_open", true);
  const { count: proCount } = await supabase
    .from("shops")
    .select("id", { count: "exact", head: true })
    .eq("plan", "pro");

  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Shop Management</h1>
          <p className="text-gray-400">
            Monitor and manage all stores on the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Shops"
          value={totalShops || 0}
          icon={Store}
          color="text-blue-500"
        />
        <StatsCard
          title="Active Now"
          value={activeCount || 0}
          icon={CheckCircle2}
          color="text-green-500"
        />
        <StatsCard
          title="Pro Users"
          value={proCount || 0}
          icon={Users}
          color="text-yellow-500"
        />
        <StatsCard
          title="Suspended"
          value={(totalShops || 0) - (activeCount || 0)}
          icon={AlertOctagon}
          color="text-red-500"
        />
      </div>

      <div className="space-y-4">
        <ShopsTableToolbar />

        <Card className="bg-[#111] border-white/10 text-white overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10 bg-white/5">
                  <TableHead className="text-gray-300">Shop Info</TableHead>
                  <TableHead className="text-gray-300">Plan</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-gray-500"
                    >
                      No shops match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  shops?.map((shop) => (
                    <TableRow
                      key={shop.id}
                      className="border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg text-[#E6B800]">
                            {shop.name.charAt(0)}
                          </div>
                          <div>
                            <Link
                              href={`/admin/shops/${shop.id}`}
                              className="font-bold hover:text-[#E6B800] transition-colors"
                            >
                              {shop.name}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>/{shop.slug}</span>
                              <a
                                href={`https://wa.me/${shop.whatsapp_number}`}
                                target="_blank"
                                className="hover:text-green-500"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize border-white/20 ${shop.plan === "pro" ? "text-[#E6B800] bg-[#E6B800]/10" : "text-gray-400"}`}
                        >
                          {shop.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            shop.is_open
                              ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                          }
                        >
                          {shop.is_open ? "Active" : "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(shop.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <Link href={`/admin/shops/${shop.id}`}>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>

                          <div className="scale-90">
                            <ImpersonateButton userId={shop.owner_id} />
                          </div>

                          <form action={toggleShopStatusAction}>
                            <input
                              type="hidden"
                              name="shopId"
                              value={shop.id}
                            />
                            <input
                              type="hidden"
                              name="desiredStatus"
                              value={String(!shop.is_open)}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className={`h-8 w-8 ${shop.is_open ? "text-red-500 hover:bg-red-500/20" : "text-green-500 hover:bg-green-500/20"}`}
                              title={shop.is_open ? "Suspend" : "Activate"}
                            >
                              {shop.is_open ? (
                                <Ban className="h-4 w-4" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </Button>
                          </form>
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
              href={`/admin/shops?page=${page > 1 ? page - 1 : 1}&q=${queryText}&status=${statusFilter}&plan=${planFilter}`}
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
              href={`/admin/shops?page=${page < totalPages ? page + 1 : totalPages}&q=${queryText}&status=${statusFilter}&plan=${planFilter}`}
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
