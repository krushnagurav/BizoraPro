"use client";
import { deleteCategoryAction } from "@/src/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CategoryDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if(!confirm("Are you sure?")) return;
    setLoading(true);
    const res = await deleteCategoryAction({ id });
    setLoading(false);
    if (res?.serverError) toast.error(res.serverError);
    else toast.success("Category deleted");
  };

  return (
    <Button size="icon" variant="ghost" onClick={handleDelete} disabled={loading} className="text-red-500 hover:bg-red-500/10">
       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}