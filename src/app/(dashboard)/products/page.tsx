import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  RefreshCcw,
  FileSpreadsheet,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteProductAction,
  restoreProductAction,
} from "@/src/actions/product-actions";
import { createClient } from "@/src/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Get Shop ID
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  // 2. Fetch ALL products (Active & Archived)
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  const activeProducts = products?.filter((p) => !p.deleted_at) || [];
  const archivedProducts = products?.filter((p) => p.deleted_at) || [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Products</h1>
        <div className="flex gap-2">
          <Link href="/products/import">
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Import
            </Button>
          </Link>
          <Link href="/products/new">
            <Button className="font-bold gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="active">
            Active ({activeProducts.length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({archivedProducts.length})
          </TabsTrigger>
        </TabsList>

        {/* ACTIVE PRODUCTS TAB */}
        <TabsContent value="active">
          <ProductTable products={activeProducts} />
        </TabsContent>

        {/* ARCHIVED PRODUCTS TAB */}
        <TabsContent value="archived">
          <div className="opacity-70">
            <ProductTable products={archivedProducts} isArchived />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- REUSABLE TABLE COMPONENT ---
function ProductTable({
  products,
  isArchived = false,
}: {
  products: any[];
  isArchived?: boolean;
}) {
  if (products.length === 0) {
    return (
      <Card className="bg-card border-border/50 mt-4">
        <CardContent className="p-12 text-center text-muted-foreground">
          No products found here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50 mt-4">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                className="border-border hover:bg-secondary/10"
              >
                <TableCell>
                  <Avatar className="h-12 w-12 rounded-lg border border-border">
                    <AvatarImage
                      src={product.image_url}
                      className="object-cover"
                    />
                    <AvatarFallback>IMG</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {!isArchived && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/products/${product.id}`}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </Link>

                        {/* DELETE BUTTON FORM */}
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <button type="submit" className="w-full">
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </button>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {isArchived && (
                    <form action={restoreProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <Button size="sm" variant="outline" className="gap-2">
                        <RefreshCcw className="h-3 w-3" /> Restore
                      </Button>
                    </form>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
