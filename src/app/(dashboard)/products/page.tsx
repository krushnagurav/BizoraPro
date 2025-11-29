import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import {
  deleteProductAction,
  duplicateProductAction,
} from "@/src/actions/product-actions";
import { ProductFilters } from "@/src/components/dashboard/products/product-filters"; // Import Filters
import { getProducts } from "@/src/data/products";
import { createClient } from "@/src/lib/supabase/server";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  FileSpreadsheet,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image"; // Use Next Image
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || "";
  const categoryId = params.category || "all";
  const status = params.status || "all";

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

  // Fetch Categories for Filter
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("shop_id", shop.id);

  // Fetch Data via DAL (Updated)
  const { data: products, metadata } = await getProducts(
    shop.id,
    currentPage,
    searchQuery,
    categoryId,
    status
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <p className="text-muted-foreground">
            Manage inventory ({metadata.totalItems})
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

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <form action="/products" method="GET">
            <Input
              name="search"
              placeholder="Search products..."
              className="pl-9 bg-card"
              defaultValue={searchQuery}
            />
            {/* Preserve filters when searching */}
            {categoryId !== "all" && (
              <input type="hidden" name="category" value={categoryId} />
            )}
            {status !== "all" && (
              <input type="hidden" name="status" value={status} />
            )}
          </form>
        </div>

        {/* Client Filter Component */}
        <ProductFilters categories={categories || []} />
      </div>

      {/* Table */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-border hover:bg-secondary/10"
                  >
                    <TableCell>
                      <div className="relative h-10 w-10 rounded-md overflow-hidden border border-border bg-secondary flex items-center justify-center">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.categories?.name || (
                        <span className="text-muted-foreground text-xs">
                          --
                        </span>
                      )}
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>
                      {product.product_skus?.length ? (
                        <Badge variant="outline" className="text-[10px]">
                          Variants
                        </Badge>
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
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          product.status === "active"
                            ? "text-green-500 border-green-500/20"
                            : "text-yellow-500 border-yellow-500/20"
                        }`}
                      >
                        {product.status}
                      </Badge>
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

                          <form action={duplicateProductAction}>
                            <input type="hidden" name="id" value={product.id} />
                            <button className="w-full">
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                            </button>
                          </form>

                          <DropdownMenuSeparator />

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

      {/* Pagination */}
      {metadata.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/products?page=${
              currentPage - 1
            }&search=${searchQuery}&category=${categoryId}&status=${status}`}
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
            href={`/products?page=${
              currentPage + 1
            }&search=${searchQuery}&category=${categoryId}&status=${status}`}
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
