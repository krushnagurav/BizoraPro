import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProductAction } from "@/src/actions/product-actions";
import { getProducts } from "@/src/data/products";
import { createClient } from "@/src/lib/supabase/server";
import {
  Badge,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  // 1. Parse URL Params
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || "";

  // 2. Auth Check
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
  if (!shop) redirect("/onboarding");

  // 3. Fetch Data via DAL
const { data: products, metadata } = await getProducts(shop.id, currentPage, searchQuery);
console.log("products:", products);
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory ({metadata.totalItems} items)
          </p>
        </div>
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

      {/* Search Bar */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {/* Server-Side Search Form */}
        <form action="/products" method="GET">
          <Input
            name="search"
            placeholder="Search products..."
            className="pl-9 bg-card"
            defaultValue={searchQuery}
          />
        </form>
      </div>

      {/* Table */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? `No matches for "${searchQuery}"`
                      : "No products yet."}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-border hover:bg-secondary/10"
                  >
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-md border border-border">
                        <AvatarImage
                          src={product.image_url}
                          className="object-cover"
                        />
                        <AvatarFallback>IMG</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>
                      {product.categories?.name || "Uncategorized"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500 capitalize">
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.variants && product.variants.length > 0 ? (
                        <span className="text-xs">
                          {product.stock_count} (Total)
                        </span>
                      ) : (
                        <span
                          className={
                            product.stock_count < 5
                              ? "text-red-500 font-bold"
                              : ""
                          }
                        >
                          {product.stock_count}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
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
                          <form action={deleteProductAction}>
                            <input type="hidden" name="id" value={product.id} />
                            <button className="w-full">
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </button>
                          </form>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {metadata.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/products?page=${currentPage - 1}&search=${searchQuery}`}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!metadata.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">
            Page {metadata.page} of {metadata.totalPages}
          </span>
          <Link
            href={`/products?page=${currentPage + 1}&search=${searchQuery}`}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!metadata.hasNextPage}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}