"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormValues } from "@/src/lib/validators/category";
import { upsertCategoryAction } from "@/src/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/src/components/dashboard/image-upload";
import { toast } from "sonner";
import { Loader2, Plus, Pencil } from "lucide-react";

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

export function CategoryForm({ initialData }: { initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      status: initialData?.status || "active",
      imageUrl: initialData?.image_url || ""
    },
  });

  // Auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (!initialData) {
       form.setValue("slug", slugify(name));
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    // Attach image state
    data.imageUrl = imageUrl;

    const res = await upsertCategoryAction(data);

    if (res?.serverError) {
      toast.error(res.serverError);
    } else if (res?.data?.success) {
      toast.success(res.data.message);
      setOpen(false);
      if(!initialData) {
          form.reset();
          setImageUrl("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {initialData ? (
          <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
        ) : (
          <Button className="font-bold gap-2"><Plus className="h-4 w-4" /> Add Category</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
          <div className="space-y-2">
             <Label>Category Image</Label>
             <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              {...form.register("name")} 
              onChange={handleNameChange} 
              placeholder="e.g. Mens Fashion" 
            />
            {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>URL Slug</Label>
            <div className="flex">
               <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-xs">
                 /shop/
               </span>
               <Input 
                 {...form.register("slug")} 
                 className="rounded-l-none" 
                 placeholder="mens-fashion" 
               />
            </div>
            {form.formState.errors.slug && <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
             <Label>Status</Label>
             <Select 
               defaultValue={form.getValues("status")} 
               onValueChange={(val: any) => form.setValue("status", val)}
             >
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="active">Active</SelectItem>
                 <SelectItem value="hidden">Hidden</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="animate-spin mr-2" /> : (initialData ? "Update" : "Create")}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}