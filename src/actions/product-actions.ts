"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// --- SHARED SCHEMA (Used for both Create and Update) ---
// This ensures logic consistency
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  salePrice: z.coerce.number().optional().nullable(),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")).nullable(),
});

// We extend the base schema for Update to require ID
const updateSchema = productSchema.extend({
  id: z.string().uuid(),
});

// ==========================================
// ACTION: CREATE PRODUCT
// ==========================================
export async function createProductAction(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  // Get Shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id, product_limit")
    .eq("owner_id", user.id)
    .single();

  if (!shop) return { error: "Shop not found" };

  // Check Limit
  const { count } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })
    .eq("shop_id", shop.id)
    .is("deleted_at", null);

  if (count && count >= shop.product_limit) {
    return { error: `Free limit reached (${shop.product_limit} products). Upgrade to Pro.` };
  }

  // Validate
  const rawData = {
    name: formData.get("name"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || null,
    category: formData.get("category"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
  };

  const parsed = productSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Insert
  const { error } = await supabase.from("products").insert({
    shop_id: shop.id,
    name: parsed.data.name,
    price: parsed.data.price,
    sale_price: parsed.data.salePrice,
    category_id: parsed.data.category,
    description: parsed.data.description,
    image_url: parsed.data.imageUrl || "",
    status: 'active'
  });

  if (error) return { error: error.message };

  // Handle Onboarding Redirect
  const { data: currentShop } = await supabase.from("shops").select("onboarding_step").eq("id", shop.id).single();
  if (currentShop && currentShop.onboarding_step < 4) {
    await supabase.from("shops").update({ onboarding_step: 4 }).eq("id", shop.id);
    redirect("/dashboard"); 
  }

  revalidatePath("/products");
  return { success: "Product Created" };
}

// ==========================================
// ACTION: UPDATE PRODUCT (The Fix)
// ==========================================
export async function updateProductAction(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Validate
  const rawData = {
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || null,
    category: formData.get("category"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
  };

  const parsed = updateSchema.safeParse(rawData);
  
  // SAFETY CHECK: This prevents the "reading '0'" crash
  if (!parsed.success) {
    console.error(parsed.error);
    return { error: parsed.error.issues[0].message };
  }

  // 2. Prepare Update Data
  const updates: any = {
    name: parsed.data.name,
    price: parsed.data.price,
    sale_price: parsed.data.salePrice,
    category_id: parsed.data.category,
    description: parsed.data.description,
  };

  // Only update image if a NEW one was provided (not empty string)
  if (parsed.data.imageUrl && parsed.data.imageUrl.length > 0) {
    updates.image_url = parsed.data.imageUrl;
  }

  // 3. Execute Update
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", parsed.data.id);

  if (error) return { error: error.message };

  revalidatePath("/products");
  redirect("/products");
}

// ==========================================
// ACTION: DELETE PRODUCT
// ==========================================
export async function deleteProductAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  
  revalidatePath("/products");
}

export async function restoreProductAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  
  // Restore: Set deleted_at to NULL
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) return { error: error.message };
  
  revalidatePath("/products");
}

// --- CATEGORY ACTIONS ---

const categorySchema = z.object({
  name: z.string().min(2, "Category name too short"),
});

export async function createCategoryAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Get Shop
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();
  if (!shop) return { error: "Shop not found" };

  // 2. Validate
  const raw = { name: formData.get("name") };
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // 3. Insert
  const { error } = await supabase
    .from("categories")
    .insert({ shop_id: shop.id, name: parsed.data.name });

  if (error) return { error: error.message };

  revalidatePath("/categories"); // Update the list instantly
  return { success: "Category Added" };
}

export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/categories");
}