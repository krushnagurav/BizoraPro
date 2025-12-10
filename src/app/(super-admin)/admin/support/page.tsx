// src/app/(super-admin)/admin/support/page.tsx
/*  * Admin Support Page
 *
 * This page provides super administrators with an interface to manage support tickets.
 * It includes ticket statistics, filtering options, and a table of current tickets.
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
import { SupportToolbar } from "@/src/components/admin/support/support-toolbar";
import { createClient } from "@/src/lib/supabase/server";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
} from "lucide-react";
import Link from "next/link";

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    priority?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const queryText = params.q || "";
  const statusFilter = params.status || "all";
  const priorityFilter = params.priority || "all";
  const page = Number(params.page) || 1;
  const itemsPerPage = 20;

  const supabase = await createClient();

  const { count: openCount } = await supabase
    .from("support_tickets")
    .select("id", { count: "exact", head: true })
    .eq("status", "open");
  const { count: criticalCount } = await supabase
    .from("support_tickets")
    .select("id", { count: "exact", head: true })
    .in("priority", ["high", "critical"])
    .eq("status", "open");
  const { count: resolvedCount } = await supabase
    .from("support_tickets")
    .select("id", { count: "exact", head: true })
    .eq("status", "resolved");

  // eslint-disable-next-line react-hooks/purity
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: slaRiskCount } = await supabase
    .from("support_tickets")
    .select("id", { count: "exact", head: true })
    .eq("status", "open")
    .lt("created_at", yesterday);

  let query = supabase
    .from("support_tickets")
    .select("*, shops(name, plan)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") query = query.eq("status", statusFilter);
  if (priorityFilter !== "all") query = query.eq("priority", priorityFilter);
  if (queryText) {
    query = query.or(`subject.ilike.%${queryText}%,id.eq.${queryText}`);
  }

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  const { data: tickets, count } = await query.range(from, to);

  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  const priorityColors: any = {
    low: "text-blue-400 border-blue-400/20",
    medium: "text-yellow-400 border-yellow-400/20",
    high: "text-orange-500 border-orange-500/20",
    critical: "text-red-500 border-red-500/20 bg-red-500/10",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Headphones className="h-8 w-8 text-primary" /> Support Queue
        </h1>
        <p className="text-gray-400">Manage and resolve shop owner issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Open Tickets"
          value={openCount || 0}
          icon={Clock}
          color="text-blue-400"
        />
        <StatsCard
          title="Critical / High"
          value={criticalCount || 0}
          icon={AlertCircle}
          color="text-red-500"
        />
        <StatsCard
          title="SLA At Risk (>24h)"
          value={slaRiskCount || 0}
          icon={Activity}
          color="text-orange-500"
        />
        <StatsCard
          title="Resolved Total"
          value={resolvedCount || 0}
          icon={CheckCircle2}
          color="text-green-500"
        />
      </div>

      <div className="space-y-4">
        <SupportToolbar />

        <Card className="bg-[#111] border-white/10 text-white overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10 bg-white/5">
                  <TableHead className="text-gray-300">Ticket Info</TableHead>
                  <TableHead className="text-gray-300">Shop</TableHead>
                  <TableHead className="text-gray-300">Priority</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500"
                    >
                      No tickets match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets?.map((t) => (
                    <TableRow
                      key={t.id}
                      className="border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <TableCell>
                        <div className="font-bold text-white">{t.subject}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          #{t.id.slice(0, 8)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                            {t.shops?.name?.charAt(0) || "?"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm">{t.shops?.name}</span>
                            <span className="text-[10px] text-gray-500 capitalize">
                              {t.shops?.plan} Plan
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize ${priorityColors[t.priority]}`}
                        >
                          {t.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            t.status === "resolved" ? "secondary" : "default"
                          }
                          className={`capitalize ${t.status === "open" ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                          {t.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(t.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/support/${t.id}`}>
                          <Button
                            size="sm"
                            className="bg-primary text-black hover:bg-primary/90 font-bold"
                          >
                            Reply <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
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
              href={`/admin/support?page=${page > 1 ? page - 1 : 1}&q=${queryText}&status=${statusFilter}&priority=${priorityFilter}`}
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
              href={`/admin/support?page=${page < totalPages ? page + 1 : totalPages}&q=${queryText}&status=${statusFilter}&priority=${priorityFilter}`}
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
