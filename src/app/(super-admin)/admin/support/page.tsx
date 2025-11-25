import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminSupportQueue() {
  const supabase = await createClient();

  // Fetch ALL tickets with Shop Name
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*, shops(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Support Queue</h1>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Ticket ID</TableHead>
                <TableHead className="text-gray-400">Shop</TableHead>
                <TableHead className="text-gray-400">Subject</TableHead>
                <TableHead className="text-gray-400">Priority</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets?.map((ticket) => (
                <TableRow key={ticket.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-mono text-xs">#{ticket.id.slice(0,6)}</TableCell>
                  <TableCell>{ticket.shops?.name}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20 text-white">
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/support/${ticket.id}`}>
                      <Button size="sm" variant="secondary">Reply</Button>
                    </Link>
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