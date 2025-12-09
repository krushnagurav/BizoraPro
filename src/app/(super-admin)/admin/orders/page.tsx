// src/app/(super-admin)/admin/orders/page.tsx
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
import { OrdersTrendChart } from "@/src/components/admin/orders-trend-chart";
import { OrdersTableToolbar } from "@/src/components/admin/orders/orders-table-toolbar"; // Import Toolbar
import { createClient } from "@/src/lib/supabase/server";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MessageCircle,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function AdminOrdersPage({
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

  // --- 1. KPI DATA (Fast Aggregates) ---
  // Note: For large scale, replace with RPC or Materialized View.
  // For MVP, select count and sum is fine.
  const { count: totalCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_amount")
    .neq("status", "cancelled"); // Exclude cancelled revenue

  const totalRevenue =
    revenueData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
  const avgOrderValue = totalCount ? Math.round(totalRevenue / totalCount) : 0;

  // --- 2. CHART DATA (Last 30 Days - Specific Query) ---
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: chartRawData } = await supabase
    .from("orders")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString());

  // Process Chart Data
  const dateMap = new Map();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dateMap.set(key, { date: key, orders: 0 });
  }
  chartRawData?.forEach((order) => {
    const key = new Date(order.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (dateMap.has(key)) dateMap.get(key).orders += 1;
  });
  const chartData = Array.from(dateMap.values());

  // --- 3. TABLE DATA (Filtered & Paginated) ---
  let query = supabase
    .from("orders")
    .select("*, shops(name, slug)", { count: "exact" })
    .order("created_at", { ascending: false });

  // Apply Filters
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  if (queryText) {
    // Search in JSONB customer_info or join (Complex).
    // MVP: Simple Filter by ID if it's UUID, else we skip or need RPC for JSON Search.
    // Let's filter by Order ID prefix for MVP if text matches.
    query = query.ilike("id", `${queryText}%`);
  }

  // Pagination
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  const { data: orders, count } = await query.range(from, to);

  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">WhatsApp Orders</h1>
          <p className="text-gray-400">
            Live feed of all transactions across the platform.
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2">
          <MessageCircle className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value={totalCount || 0}
          icon={ShoppingBag}
          color="text-blue-500"
        />
        <StatsCard
          title="Total GMV (Revenue)"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="text-green-500"
        />
        <StatsCard
          title="Avg. Order Value"
          value={`₹${avgOrderValue}`}
          icon={DollarSignIcon}
          color="text-yellow-500"
        />
        <StatsCard
          title="Recent Volume (30d)"
          value={chartRawData?.length || 0}
          icon={Clock}
          color="text-purple-500"
        />
      </div>

      {/* GRAPH */}
      <OrdersTrendChart data={chartData} />

      {/* TABLE SECTION */}
      <div className="space-y-4">
        <OrdersTableToolbar />

        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10 bg-white/5">
                  <TableHead className="text-gray-300">Order</TableHead>
                  <TableHead className="text-gray-300">Shop</TableHead>
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-gray-500"
                    >
                      No orders match your filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders?.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="font-mono font-bold text-xs text-gray-400">
                        #{order.id.slice(0, 6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/shops/${order.shop_id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {order.shops?.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {order.customer_info?.name || "Guest"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {order.customer_info?.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        ₹{order.total_amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize border ${
                            order.status === "placed"
                              ? "border-yellow-500 text-yellow-500 bg-yellow-500/10"
                              : order.status === "confirmed"
                                ? "border-blue-500 text-blue-500 bg-blue-500/10"
                                : order.status === "delivered"
                                  ? "border-green-500 text-green-500 bg-green-500/10"
                                  : "border-gray-500 text-gray-500 bg-gray-500/10"
                          }`}
                          variant="outline"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`/${order.shops?.slug}/o/${order.id}`}
                          target="_blank"
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-white/10 text-gray-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Link
              href={`/admin/orders?page=${page > 1 ? page - 1 : 1}&q=${queryText}&status=${statusFilter}`}
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
              href={`/admin/orders?page=${page < totalPages ? page + 1 : totalPages}&q=${queryText}&status=${statusFilter}`}
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

function DollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
