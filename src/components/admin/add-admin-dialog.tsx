// src/components/admin/add-admin-dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAdminUserAction } from "@/src/actions/admin-actions";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AddAdminDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await createAdminUserAction(formData);
    setLoading(false);

    if (result?.error) toast.error(result.error);
    else {
      toast.success("Admin user added");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-black font-bold hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              name="fullName"
              className="bg-[#050505] border-white/10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              className="bg-[#050505] border-white/10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select name="role" defaultValue="support">
              <SelectTrigger className="bg-[#050505] border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="support">Support Agent</SelectItem>
                <SelectItem value="finance">Finance Manager</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-black font-bold"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
