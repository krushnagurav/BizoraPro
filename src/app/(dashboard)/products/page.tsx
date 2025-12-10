// src/app/(dashboard)/products/page.tsx
/*
 * Products Page
 * This component displays the list of products in the BizoraPro dashboard.
 * It includes search, filtering, pagination, and options to add or import products.
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BulkPriceDialog } from "@/src/components/dashboard/products/bulk-price-dialog";
import { ProductFilters } from "@/src/components/dashboard/products/product-filters"; // Import Filters
import { ProductListTable } from "@/src/components/dashboard/products/product-list-table";
import { getProducts } from "@/src/data/products";
import { createClient } from "@/src/lib/supabase/server";
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Plus,
  Search,
} from "lucide-react";
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
    .select("id, slug")
    .eq("owner_id", user.id)
    .single();
  if (!shop) redirect("/onboarding");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("shop_id", shop.id);

  const { data: products, metadata } = await getProducts(
    shop.id,
    currentPage,
    searchQuery,
    categoryId,
    status,
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <p className="text-muted-foreground">
            Manage inventory ({metadata.totalItems})
          </p>
        </div>
        <div className="flex gap-2">
          <BulkPriceDialog categories={categories || []} />
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
            {categoryId !== "all" && (
              <input type="hidden" name="category" value={categoryId} />
            )}
            {status !== "all" && (
              <input type="hidden" name="status" value={status} />
            )}
          </form>
        </div>

        <ProductFilters categories={categories || []} />
      </div>

      <ProductListTable products={products} slug={shop.slug} />

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
