import Link from "next/link";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/src/components/dashboard/products/edit-form";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";

// 1. Change Type Definition to Promise
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  
  // 2. AWAIT the params to get the ID
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();

// Get Shop & Product
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user!.id).single();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();

  if (!product) notFound();

  // Get Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("shop_id", shop?.id);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/products" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-primary mb-8">Edit Product</h1>

      <EditProductForm product={product} categories={categories || []} />
    </div>
  );
}