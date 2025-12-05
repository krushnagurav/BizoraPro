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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/src/lib/supabase/server";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Headphones,
} from "lucide-react";
import Link from "next/link";

export default async function AdminSupportPage() {
  const supabase = await createClient();

  // 1. Fetch All Tickets with Shop Details
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*, shops(name, plan)")
    .order("created_at", { ascending: false });

  // 2. Calculate Stats
  const total = tickets?.length || 0;
  const open = tickets?.filter((t) => t.status !== "resolved") || [];
  const critical = open.filter(
    (t) => t.priority === "critical" || t.priority === "high",
  ).length;
  const resolved = tickets?.filter((t) => t.status === "resolved") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Headphones className="h-8 w-8 text-primary" /> Support Queue
        </h1>
        <p className="text-gray-400">Manage and resolve shop owner issues.</p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase">Open Tickets</p>
              <p className="text-2xl font-bold text-blue-400">{open.length}</p>
            </div>
            <Clock className="h-6 w-6 text-blue-400 opacity-20" />
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase">Critical / High</p>
              <p className="text-2xl font-bold text-red-500">{critical}</p>
            </div>
            <AlertCircle className="h-6 w-6 text-red-500 opacity-20" />
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase">Resolved</p>
              <p className="text-2xl font-bold text-green-500">
                {resolved.length}
              </p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-500 opacity-20" />
          </CardContent>
        </Card>
        {/* Efficiency metric placeholder */}
        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase">Total Volume</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <Headphones className="h-6 w-6 text-gray-500 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {/* TICKET LIST */}
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="bg-[#111] border border-white/10">
          <TabsTrigger value="open">Open Queue ({open.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved History</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6">
          <TicketTable tickets={open} />
        </TabsContent>
        <TabsContent value="resolved" className="mt-6">
          <TicketTable tickets={resolved} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TicketTable({ tickets }: { tickets: any[] }) {
  const priorityColors: any = {
    low: "text-blue-400 border-blue-400/20",
    medium: "text-yellow-400 border-yellow-400/20",
    high: "text-orange-500 border-orange-500/20",
    critical: "text-red-500 border-red-500/20 bg-red-500/10",
  };

  return (
    <Card className="bg-[#111] border-white/10">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="text-gray-400">Ticket</TableHead>
              <TableHead className="text-gray-400">Shop</TableHead>
              <TableHead className="text-gray-400">Priority</TableHead>
              <TableHead className="text-gray-400">Created</TableHead>
              <TableHead className="text-right text-gray-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-gray-500"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((t) => (
                <TableRow
                  key={t.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell>
                    <div className="font-bold text-white">{t.subject}</div>
                    <div className="text-xs text-gray-500">
                      #{t.id.slice(0, 8)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{t.shops?.name}</div>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-white/20 text-gray-400"
                    >
                      {t.shops?.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${priorityColors[t.priority]}`}
                    >
                      {t.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {new Date(t.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/support/${t.id}`}>
                      <Button
                        size="sm"
                        className="bg-primary text-black hover:bg-primary/90"
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
  );
}
