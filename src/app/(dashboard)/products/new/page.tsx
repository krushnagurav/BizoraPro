// src/app/(dashboard)/products/new/page.tsx
/*
 * Add Product Page
 * This component provides a form for adding new products to the BizoraPro dashboard.
 * It includes fields for product details and integrates with the backend to save
 * the new product information.
 */
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { AddProductForm } from "@/src/components/dashboard/products/add-form";
import { ArrowLeft } from "lucide-react";

export default async function AddProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: shop } = await supabase
    .from("shops")
    .select("id, plan")
    .eq("owner_id", user!.id)
    .single();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("shop_id", shop?.id)
    .order("name", { ascending: true });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href="/products"
        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-primary mb-8">Add New Product</h1>

      <AddProductForm
        categories={categories || []}
        plan={shop?.plan || "free"}
      />
    </div>
  );
}
