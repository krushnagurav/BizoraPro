import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddAdminDialog } from "@/src/components/admin/add-admin-dialog";
import { AdminProfileSidebar } from "@/src/components/admin/users/admin-profile-sidebar"; // Import new component
import { createClient } from "@/src/lib/supabase/server";
import { Eye, Search } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const selectedUserId = params.id;

  const supabase = await createClient();
  const { data: users } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at");

  // Find selected user for sidebar
  const selectedUser = users?.find((u) => u.id === selectedUserId);

  return (
    <div className="flex gap-8 h-[calc(100vh-100px)]">
      {/* LEFT: LIST */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Team & Permissions
            </h1>
            <p className="text-gray-400">Manage admin access.</p>
          </div>
          <AddAdminDialog />
        </div>

        {/* Toolbar */}
        <div className="flex gap-4 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search team members..."
              className="pl-9 bg-[#111] border-white/10"
            />
          </div>
          {/* Add Role Filter Dropdown here if needed */}
        </div>

        <Card className="bg-[#111] border-white/10 text-white flex-1 overflow-hidden">
          <CardContent className="p-0 h-full overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10 bg-white/5 sticky top-0">
                  <TableHead className="text-gray-300">Admin Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow
                    key={user.id}
                    className={`border-white/10 hover:bg-white/5 cursor-pointer ${selectedUserId === user.id ? "bg-white/5 border-l-4 border-l-primary" : ""}`}
                  >
                    <TableCell className="font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        {user.full_name?.charAt(0)}
                      </div>
                      {user.full_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-white/20 text-gray-400 capitalize"
                      >
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-400">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/users?id=${user.id}`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-white/10 text-gray-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: PROFILE SIDEBAR */}
      {selectedUser && <AdminProfileSidebar user={selectedUser} />}
    </div>
  );
}
