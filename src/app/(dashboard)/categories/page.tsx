// src/app/(dashboard)/categories/page.tsx
/*
 * Categories Management Page
 * This component allows users to manage product categories for their BizoraPro shop.
 * Users can create, view, edit, and delete categories to organize their products
 * effectively.
 */
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
import { CategoryForm } from "@/src/components/dashboard/categories/category-form";
import { CategoryDeleteButton } from "@/src/components/dashboard/categories/delete-btn";
import { Tag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  const { data: categories } = await supabase
    .from("categories")
    .select("*, products(count)")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Categories</h1>
          <p className="text-muted-foreground">Organize your products</p>
        </div>
        <CategoryForm />
      </div>

      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead>Name & URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No categories yet. Create one above!
                  </TableCell>
                </TableRow>
              ) : (
                categories?.map((cat) => (
                  <TableRow
                    key={cat.id}
                    className="border-border hover:bg-secondary/10"
                  >
                    <TableCell>
                      <div className="relative w-10 h-10 bg-secondary rounded-md overflow-hidden flex items-center justify-center">
                        {cat.image_url ? (
                          <Image
                            src={cat.image_url}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Tag className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        /{cat.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cat.status === "active" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {cat.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>{cat.products[0]?.count || 0} Items</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {cat.views}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <CategoryForm initialData={cat} />
                      <CategoryDeleteButton id={cat.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
