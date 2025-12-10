// src/components/dashboard/categories/add-category-dialog.tsx
/*  * Add Category Dialog Component
 * This component provides a dialog
 * interface for adding new categories
 * to the dashboard, including form
 * handling and user feedback.
 */
"use client";

import { useState } from "react";
import { createCategoryAction } from "@/src/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") ?? "").toString().trim();

    if (!name) {
      setLoading(false);
      toast.error("Please provide a category name.");
      return;
    }

    try {
      const result = await createCategoryAction({ name });

      setLoading(false);

      if (typeof result === "string" || !!result) {
        toast.success("Category created!");
        setOpen(false);
        (event.currentTarget as HTMLFormElement).reset();
        return;
      }

      const maybe = result as any;
      const message =
        maybe?.error ??
        maybe?.message ??
        maybe?._errors?.[0] ??
        (maybe?.name && "Validation failed");

      if (message) {
        toast.error(String(message));
      } else {
        toast.success("Category created!");
        setOpen(false);
        (event.currentTarget as HTMLFormElement).reset();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-[100]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input name="name" placeholder="e.g. Summer Collection" required />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Save Category"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
