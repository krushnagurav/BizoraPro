"use client";

import { useOptimistic, startTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  ImageIcon,
  Info,
} from "lucide-react";
import {
  deleteProductAction,
  duplicateProductAction,
} from "@/src/actions/product-actions";
import { toast } from "sonner";
import { ProductShareButton } from "./product-share-button";

export function ProductListTable({
  products,
  slug,
}: {
  products: any[];
  slug: string;
}) {
  // 🚀 OPTIMISTIC UI: Delete instantly updates the list
  const [optimisticProducts, removeOptimisticProduct] = useOptimistic(
    products,
    (state, idToRemove) => state.filter((p) => p.id !== idToRemove),
  );

  const handleDelete = async (id: string) => {
    startTransition(() => {
      removeOptimisticProduct(id);
    });

    const result = await deleteProductAction({ id });

    if (!result) {
      toast.error("Something went wrong while deleting the product.");
      return;
    }

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    if (result.data?.success) {
      toast.success("Product deleted");
    } else {
      toast.error("Could not delete product.");
    }
  };

  return (
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
            {optimisticProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              optimisticProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-border hover:bg-secondary/10"
                >
                  {/* 🖼️ OPTIMIZED IMAGE */}
                  <TableCell>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden border border-border bg-secondary flex items-center justify-center">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={40} // ⚡ Fixed small width
                          height={40} // ⚡ Fixed small height
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.categories?.name || (
                      <span className="text-muted-foreground text-xs">--</span>
                    )}
                  </TableCell>
                  <TableCell>₹{product.price}</TableCell>

                  {/* 📦 SMART STOCK WITH HOVER */}
                  <TableCell>
                    {product.product_skus?.length > 0 ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Badge
                            variant="outline"
                            className="cursor-help text-[10px] gap-1"
                          >
                            Variants <Info className="h-3 w-3" />
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto p-3">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">
                              Stock Breakdown
                            </h4>
                            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
                              {product.product_skus.map((sku: any) => (
                                <div
                                  key={sku.code}
                                  className="flex justify-between gap-4"
                                >
                                  <span>{sku.code}:</span>
                                  <span
                                    className={
                                      sku.stock < 5
                                        ? "text-red-500 font-bold"
                                        : "text-foreground"
                                    }
                                  >
                                    {sku.stock}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 mt-2 border-t border-border flex justify-between text-xs font-bold">
                              <span>Total:</span>
                              <span>{product.stock_count}</span>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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
                    <ProductShareButton
                      slug={slug}
                      productId={product.id}
                      name={product.name}
                    />
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
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
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
  );
}
