"use server";

import { authAction } from "@/src/lib/safe-action";
import { createProductSchema, updateProductSchema, productIdSchema } from "@/src/lib/validators/product";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { z } from "zod";

// ==========================================
// 1. CREATE PRODUCT (Safe Action)
// ==========================================
export const createProductAction = authAction
  .schema(createProductSchema)
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    
    const { data: shop } = await supabase
      .from("shops")
      .select("id, product_limit, onboarding_step")
      .eq("owner_id", user.id)
      .single();

    if (!shop) throw new Error("Shop not found");

    const { count } = await supabase
      .from("products")
      .select("*", { count: 'exact', head: true })
      .eq("shop_id", shop.id)
      .is("deleted_at", null);

    if (count && count >= shop.product_limit) {
      throw new Error(`Limit reached (${shop.product_limit}). Upgrade to Pro.`);
    }

    // 1. Parse JSON Fields
    let variantsData = [], galleryData = [], badgesData = [], skusData: any[] = [];
    try {
      if (parsedInput.variants) variantsData = JSON.parse(parsedInput.variants);
      if (parsedInput.galleryImages) galleryData = JSON.parse(parsedInput.galleryImages);
      if (parsedInput.badges) badgesData = JSON.parse(parsedInput.badges);
      // 👇 RE-ADDED: SKU Parsing
      if (parsedInput.productSkus) skusData = JSON.parse(parsedInput.productSkus);
    } catch (e) { console.error("JSON Parse Error", e); }

    // 2. 🧠 SMART STOCK LOGIC
    // If variants exist, calculate total stock from SKUs. Otherwise use simple stock input.
    let finalStock = parsedInput.stock || 0; 
    if (skusData.length > 0) {
       finalStock = skusData.reduce((acc: number, sku: any) => acc + Number(sku.stock || 0), 0);
    }

    const categoryId = (parsedInput.category && parsedInput.category !== "none" && parsedInput.category !== "") 
      ? parsedInput.category 
      : null;

    const { error } = await supabase.from("products").insert({
      shop_id: shop.id,
      name: parsedInput.name,
      price: parsedInput.price,
      sale_price: parsedInput.salePrice,
      category_id: categoryId,
      description: parsedInput.description,
      image_url: parsedInput.imageUrl || "",
      status: parsedInput.status,
      seo_title: parsedInput.seoTitle,
      seo_description: parsedInput.seoDescription,
      variants: variantsData,
      gallery_images: galleryData,
      badges: badgesData,
      product_skus: skusData,
      stock_count: finalStock
    });

    if (error) throw new Error(error.message);

    let redirectTo = "/products";
    if (shop.onboarding_step < 4) {
      await supabase.from("shops").update({ onboarding_step: 4 }).eq("id", shop.id);
      redirectTo = "/dashboard";
    }

    revalidatePath("/products");
    return { success: true, redirect: redirectTo };
  });

// ==========================================
// 2. UPDATE PRODUCT (Safe Action)
// ==========================================
export const updateProductAction = authAction
  .schema(updateProductSchema)
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    
    // 1. Parse JSON
    let variantsData = [], galleryData = [], badgesData = [], skusData: any[] = [];
    try {
      if (parsedInput.variants) variantsData = JSON.parse(parsedInput.variants);
      if (parsedInput.galleryImages) galleryData = JSON.parse(parsedInput.galleryImages);
      if (parsedInput.badges) badgesData = JSON.parse(parsedInput.badges);
      // 👇 RE-ADDED: SKU Parsing
      if (parsedInput.productSkus) skusData = JSON.parse(parsedInput.productSkus);
    } catch (e) { console.error(e); }

    // 2. 🧠 SMART STOCK LOGIC
    let finalStock = parsedInput.stock || 0;
    if (skusData.length > 0) {
       finalStock = skusData.reduce((acc: number, sku: any) => acc + Number(sku.stock || 0), 0);
    }

    const categoryId = (parsedInput.category && parsedInput.category !== "none" && parsedInput.category !== "") 
      ? parsedInput.category 
      : null;

    const updates: any = {
      name: parsedInput.name,
      price: parsedInput.price,
      sale_price: parsedInput.salePrice,
      category_id: categoryId,
      description: parsedInput.description,
      status: parsedInput.status,
      seo_title: parsedInput.seoTitle,
      seo_description: parsedInput.seoDescription,
      variants: variantsData,
      gallery_images: galleryData,
      badges: badgesData,
      product_skus: skusData,
      stock_count: finalStock
    };

    if (parsedInput.imageUrl) updates.image_url = parsedInput.imageUrl;

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", parsedInput.id);

    if (error) throw new Error(error.message);

    revalidatePath("/products");
    return { success: true };
  });

// ==========================================
// 3. DELETE / RESTORE (Safe Action)
// ==========================================
export const deleteProductAction = authAction
  .schema(productIdSchema)
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const { error } = await supabase
      .from("products")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", parsedInput.id);

    if (error) throw new Error(error.message);
    revalidatePath("/products");
    return { success: true };
  });

export const restoreProductAction = authAction
  .schema(productIdSchema)
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const { error } = await supabase
      .from("products")
      .update({ deleted_at: null })
      .eq("id", parsedInput.id);

    if (error) throw new Error(error.message);
    revalidatePath("/products");
    return { success: true };
  });

// ==========================================
// 4. CATEGORY ACTIONS (Safe Action)
// ==========================================
const categorySchema = z.object({ name: z.string().min(2) });
const categoryIdSchema = z.object({ id: z.string().uuid() });

export const createCategoryAction = authAction
  .schema(categorySchema)
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).single();
    if (!shop) throw new Error("Shop not found");

    const { error } = await supabase
      .from("categories")
      .insert({ shop_id: shop.id, name: parsedInput.name });

    if (error) throw new Error(error.message);
    revalidatePath("/categories");
    return { success: true };
  });

export const deleteCategoryAction = authAction
  .schema(categoryIdSchema)
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", parsedInput.id);

    if (error) throw new Error(error.message);
    revalidatePath("/categories");
    return { success: true };
  });


// ==========================================
// 5. DATA FETCHER (Read Only - Standard Async)
// ==========================================
export async function getProductsAction(
  shopId: string, 
  page: number = 1, 
  limit: number = 10,
  query: string = ""
) {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let dbQuery = supabase
    .from("products")
    .select("*, categories(name)", { count: "exact" })
    .eq("shop_id", shopId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    dbQuery = dbQuery.ilike("name", `%${query}%`);
  }

  const { data, count, error } = await dbQuery;

  if (error) {
    console.error("Error fetching products:", error);
    return { data: [], totalPages: 0, error: error.message };
  }

  return {
    data,
    totalPages: Math.ceil((count || 0) / limit),
    totalItems: count
  };
}

// ==========================================
// 6. SMART BULK IMPORT (Standard Async)
// ==========================================
export async function importProductsAction(products: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Login required" };

  const { data: shop } = await supabase
    .from("shops")
    .select("id, product_limit, plan")
    .eq("owner_id", user.id)
    .single();

  if (!shop) return { error: "Shop not found" };

  if (shop.plan !== 'pro') {
    return { error: "Bulk Import is a Pro feature." };
  }

  const { count } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })
    .eq("shop_id", shop.id)
    .is("deleted_at", null);

  const currentCount = count || 0;
  const newCount = currentCount + products.length;

  if (newCount > shop.product_limit) {
    return { 
      error: `Import failed. Limit exceeded. You can add ${shop.product_limit - currentCount} more.` 
    };
  }

  const { data: existingProducts } = await supabase
    .from("products")
    .select("name")
    .eq("shop_id", shop.id)
    .is("deleted_at", null);

  const existingNames = new Set(existingProducts?.map(p => p.name.toLowerCase().trim()));

  let { data: existingCats } = await supabase
    .from("categories")
    .select("id, name")
    .eq("shop_id", shop.id);

  const categoryMap = new Map<string, string>();
  existingCats?.forEach(c => categoryMap.set(c.name.toLowerCase(), c.id));

  const toInsert = [];
  let skippedCount = 0;
  let newCategoriesCount = 0;

  for (const item of products) {
    if (!item.Name || !item.Price) {
      skippedCount++;
      continue;
    }

    const cleanName = item.Name.trim();
    if (existingNames.has(cleanName.toLowerCase())) {
      skippedCount++;
      continue;
    }

    const cleanPrice = Number(item.Price.toString().replace(/[^0-9.]/g, ""));
    if (isNaN(cleanPrice)) {
      skippedCount++;
      continue;
    }

    let categoryId = null;
    if (item.Category) {
      const cleanCatName = item.Category.trim();
      const lowerCatName = cleanCatName.toLowerCase();

      if (categoryMap.has(lowerCatName)) {
        categoryId = categoryMap.get(lowerCatName);
      } else {
        const { data: newCat } = await supabase
          .from("categories")
          .insert({ shop_id: shop.id, name: cleanCatName })
          .select("id")
          .single();
        
        if (newCat) {
          categoryMap.set(lowerCatName, newCat.id);
          categoryId = newCat.id;
          newCategoriesCount++;
        }
      }
    }

    toInsert.push({
      shop_id: shop.id,
      name: cleanName,
      price: cleanPrice,
      description: item.Description || "",
      category_id: categoryId,
      status: 'active',
      image_url: "" 
    });
    
    existingNames.add(cleanName.toLowerCase());
  }

  if (toInsert.length === 0) {
    return { success: `No new products added. (${skippedCount} skipped)` };
  }

  const { error } = await supabase.from("products").insert(toInsert);
  if (error) return { error: error.message };

  revalidatePath("/products");
  return { 
    success: `Imported ${toInsert.length} products! (${skippedCount} skipped, ${newCategoriesCount} new categories)` 
  };
}

// ==========================================
// 7. DUPLICATE PRODUCT
// ==========================================
export async function duplicateProductAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  
  // 1. Fetch Original
  const { data: original } = await supabase.from("products").select("*").eq("id", id).single();
  if (!original) return { error: "Product not found" };

  // 2. Create Copy Payload (Remove unique IDs)
  // We append "(Copy)" to the name so user knows
  const { id: _, created_at: __, ...rest } = original;
  
  const payload = {
    ...rest,
    name: `${original.name} (Copy)`,
    status: 'draft', // Safety Net: Always draft first
    stock_count: 0 // Reset stock for safety
  };

  // 3. Insert
  const { error } = await supabase.from("products").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/products");
  return { success: "Product duplicated!" };
}