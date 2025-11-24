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
import { AddCategoryDialog } from "@/src/components/dashboard/categories/add-category-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Tag } from "lucide-react";
import { deleteCategoryAction } from "@/src/actions/product-actions";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get Shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  // Get Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*, products(count)") // Bonus: Count products in this category
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Categories</h1>
          <p className="text-muted-foreground">Organize your products</p>
        </div>
        <div className="w-full sm:w-auto">
          <AddCategoryDialog />
        </div>
      </div>

      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Name</TableHead>
                <TableHead>Products Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
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
                    <TableCell className="font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      {cat.name}
                    </TableCell>
                    <TableCell>{cat.products[0]?.count || 0} Items</TableCell>
                    <TableCell className="text-right">
                      <form action={deleteCategoryAction}>
                        <input type="hidden" name="id" value={cat.id} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
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
