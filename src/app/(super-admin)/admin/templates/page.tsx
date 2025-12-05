import Link from "next/link";
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
import { Plus, Edit, Trash2, Mail, MessageCircle } from "lucide-react";
import { deleteTemplateAction } from "@/src/actions/admin-actions";

export default async function AdminTemplatesPage() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from("notification_templates")
    .select("*")
    .order("created_at");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Notification Templates
        </h1>
        <Link href="/admin/templates/new">
          <Button className="bg-primary text-black font-bold hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Create Template
          </Button>
        </Link>
      </div>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Channel</TableHead>
                <TableHead className="text-gray-400">Subject</TableHead>
                <TableHead className="text-right text-gray-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates?.map((t) => (
                <TableRow
                  key={t.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium">
                    <div>{t.name}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {t.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-white/20 text-gray-300 gap-1 capitalize"
                    >
                      {t.channel === "email" ? (
                        <Mail className="h-3 w-3" />
                      ) : (
                        <MessageCircle className="h-3 w-3" />
                      )}
                      {t.channel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 truncate max-w-[200px]">
                    {t.subject || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/templates/${t.id}`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-white/10 text-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={deleteTemplateAction}>
                        <input type="hidden" name="id" value={t.id} />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-red-900/20 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
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
