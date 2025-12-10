// src/app/(dashboard)/marketing/leads/page.tsx
/*
 * CRM & Leads Page
 * This component displays and manages customer leads for the BizoraPro
 * dashboard. Users can view lead statistics, manage their subscriber list,
 * and take actions such as contacting leads or exporting data.
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
import { ExportLeadsButton } from "@/src/components/dashboard/marketing/export-leads-btn";
import { LeadRowActions } from "@/src/components/dashboard/marketing/lead-row-actions";
import { createClient } from "@/src/lib/supabase/server";
import { Filter, TrendingUp, Users } from "lucide-react";

export default async function LeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: shop } = await supabase
    .from("shops")
    .select("id, name")
    .eq("owner_id", user!.id)
    .single();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  const { data: templates } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .eq("shop_id", shop?.id)
    .eq("category", "marketing");

  const totalLeads = leads?.length || 0;
  const today = new Date().toISOString().split("T")[0];
  const newToday =
    leads?.filter((l) => l.created_at.startsWith(today)).length || 0;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Users className="h-8 w-8" /> CRM & Leads
          </h1>
          <p className="text-muted-foreground">
            Manage and chat with your subscribers.
          </p>
        </div>
        <ExportLeadsButton data={leads || []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Subscribers
              </p>
              <h3 className="text-2xl font-bold">{totalLeads}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                New Today
              </p>
              <h3 className="text-2xl font-bold">+{newToday}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-primary mb-1">💡 Pro Tip</p>
              <p className="text-xs text-muted-foreground">
                Send a broadcast message to these leads on festivals!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscriber List</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Name & Phone</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads?.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="border-border hover:bg-secondary/10"
                >
                  <TableCell>
                    <div className="font-medium">{lead.name || "Guest"}</div>
                    <div className="text-xs text-muted-foreground">
                      {lead.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-xs">
                      {lead.source || "Store"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {lead.last_contacted_at ? (
                      <span className="text-green-500">
                        Cntd.{" "}
                        {new Date(lead.last_contacted_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">Never</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <LeadRowActions
                      lead={lead}
                      shopName={shop?.name}
                      templates={templates || []}
                    />
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
