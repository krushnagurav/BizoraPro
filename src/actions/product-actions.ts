"use server";

import { authAction } from "@/src/lib/safe-action";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "@/src/lib/validators/product";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { z } from "zod";

// ==========================================
// 1. CREATE PRODUCT (Safe Action)
// ==========================================
export const createProductAction = authAction
  .schema(createProductSchema)
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    // 1. Get Shop & Check Limits
    const { data: shop } = await supabase
      .from("shops")
      .select("id, product_limit, onboarding_step")
      .eq("owner_id", user.id)
      .single();

    if (!shop) throw new Error("Shop not found");

    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .is("deleted_at", null);

    if (count && count >= shop.product_limit) {
      throw new Error(`Limit reached (${shop.product_limit}). Upgrade to Pro.`);
    }

    // 2. Parse JSON Fields
    let variantsData = [],
      galleryData = [],
      badgesData = [],
      skusData: any[] = [];
    try {
      if (parsedInput.variants) variantsData = JSON.parse(parsedInput.variants);
      if (parsedInput.galleryImages)
        galleryData = JSON.parse(parsedInput.galleryImages);
      if (parsedInput.badges) badgesData = JSON.parse(parsedInput.badges);
      // Parse SKUs
      if (parsedInput.productSkus)
        skusData = JSON.parse(parsedInput.productSkus);
    } catch (e) {
      console.error("JSON Parse Error", e);
    }

    // 3. Smart Stock Calculation
    // If variants exist, calculate total stock from SKUs. Otherwise use simple stock input.
    let finalStock = parsedInput.stock || 0;
    if (skusData.length > 0) {
      finalStock = skusData.reduce(
        (acc: number, sku: any) => acc + Number(sku.stock || 0),
        0,
      );
    }

    // 4. Handle Category (Convert "" to null)
    const categoryId =
      parsedInput.category &&
      parsedInput.category !== "none" &&
      parsedInput.category !== ""
        ? parsedInput.category
        : null;

    // 5. Insert
    const { error } = await supabase.from("products").insert({
      shop_id: shop.id,
      name: parsedInput.name,
      price: parsedInput.price,
      sale_price: parsedInput.salePrice,
      category_id: categoryId,
      description: parsedInput.description,
      image_url: parsedInput.imageUrl || "",
      status: parsedInput.status || "active",

      // SEO Fields
      seo_title: parsedInput.seoTitle,
      seo_description: parsedInput.seoDescription,

      // Complex Data
      variants: variantsData,
      gallery_images: galleryData,
      badges: badgesData,
      product_skus: skusData,
      stock_count: finalStock,
    });

    if (error) throw new Error(error.message);

    // Handle Onboarding Redirect
    let redirectTo = "/products";
    if (shop.onboarding_step < 4) {
      await supabase
        .from("shops")
        .update({ onboarding_step: 4 })
        .eq("id", shop.id);
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
    let variantsData = [],
      galleryData = [],
      badgesData = [],
      skusData: any[] = [];
    try {
      if (parsedInput.variants) variantsData = JSON.parse(parsedInput.variants);
      if (parsedInput.galleryImages)
        galleryData = JSON.parse(parsedInput.galleryImages);
      if (parsedInput.badges) badgesData = JSON.parse(parsedInput.badges);
      if (parsedInput.productSkus)
        skusData = JSON.parse(parsedInput.productSkus);
    } catch (e) {
      console.error(e);
    }

    // Smart Stock Calc
    let finalStock = parsedInput.stock || 0;
    if (skusData.length > 0) {
      finalStock = skusData.reduce(
        (acc: number, sku: any) => acc + Number(sku.stock || 0),
        0,
      );
    }

    const categoryId =
      parsedInput.category &&
      parsedInput.category !== "none" &&
      parsedInput.category !== ""
        ? parsedInput.category
        : null;

    const updates: any = {
      name: parsedInput.name,
      price: parsedInput.price,
      sale_price: parsedInput.salePrice,
      category_id: categoryId,
      description: parsedInput.description,
      status: parsedInput.status, // Allow updating status

      seo_title: parsedInput.seoTitle,
      seo_description: parsedInput.seoDescription,

      variants: variantsData,
      gallery_images: galleryData,
      badges: badgesData,
      product_skus: skusData,
      stock_count: finalStock,
    };

    if (parsedInput.imageUrl) updates.image_url = parsedInput.imageUrl;

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", parsedInput.id);

    if (error) throw new Error(error.message);
    // choose redirect: published -> product page, draft -> listing
    let redirectTo: string | undefined;
    try {
      // parsedInput.id should be the product id being updated
      const productId = parsedInput.id as string | undefined;
      if (parsedInput.status === "active" && productId) {
        redirectTo = `/products/${productId}`;
      } else {
        redirectTo = "/products";
      }
    } catch (e) {
      // fallback: no redirect
      redirectTo = undefined;
    }

    revalidatePath("/products");

    // return an object with optional redirect to match createProductAction's shape
    return { success: true, redirect: redirectTo };
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
    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("owner_id", user.id)
      .single();
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
// 5. DATA FETCHING (Standard Async - For Reading)
// ==========================================
export async function getProductsAction(
  shopId: string,
  page: number = 1,
  limit: number = 10,
  query: string = "",
  categoryId: string = "all",
  status: string = "all",
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

  // Apply Filters
  if (categoryId && categoryId !== "all") {
    dbQuery = dbQuery.eq("category_id", categoryId);
  }
  if (status && status !== "all") {
    dbQuery = dbQuery.eq("status", status);
  }

  const { data, count, error } = await dbQuery;

  if (error) {
    console.error("Error fetching products:", error);
    return { data: [], totalPages: 0, error: error.message };
  }

  return {
    data,
    totalPages: Math.ceil((count || 0) / limit),
    totalItems: count,
  };
}

// ==========================================
// 6. SMART BULK IMPORT (Standard Async - Robust)
// ==========================================
export async function importProductsAction(products: any[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  // 1. Get Shop & Limits (With Plan)
  const { data: shop } = await supabase
    .from("shops")
    .select("id, product_limit, plan")
    .eq("owner_id", user.id)
    .single();

  if (!shop) return { error: "Shop not found" };

  // Pro Check
  if (shop.plan !== "pro") {
    return { error: "Bulk Import is a Pro feature." };
  }

  // Limit Check
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shop.id)
    .is("deleted_at", null);

  const currentCount = count || 0;
  if (currentCount + products.length > shop.product_limit) {
    return {
      error: `Import limit exceeded. You can add ${
        shop.product_limit - currentCount
      } more.`,
    };
  }

  // 2. Prepare Deduplication
  const { data: existingProducts } = await supabase
    .from("products")
    .select("name")
    .eq("shop_id", shop.id)
    .is("deleted_at", null);
  const existingNames = new Set(
    existingProducts?.map((p) => p.name.toLowerCase().trim()),
  );

  const { data: existingCats } = await supabase
    .from("categories")
    .select("id, name")
    .eq("shop_id", shop.id);
  const categoryMap = new Map<string, string>();
  existingCats?.forEach((c) => categoryMap.set(c.name.toLowerCase(), c.id));

  // 3. Process Rows (Normalization Logic)
  const toInsert = [];
  let skippedCount = 0;

  for (const item of products) {
    // Normalize Keys (Handle "Name", "name", "Product Name")
    const safeItem: any = {};
    Object.keys(item).forEach((k) => {
      safeItem[k.toLowerCase().replace(/[^a-z]/g, "")] = item[k];
    });

    // Extract Fields safely
    const rawName = safeItem.name || safeItem.productname || safeItem.title;
    const rawPrice = safeItem.price || safeItem.sellingprice || safeItem.mrp;
    const rawDesc = safeItem.description || safeItem.desc || "";
    const rawCat = safeItem.category || safeItem.categoryname;

    // Validate
    if (!rawName || !rawPrice) {
      skippedCount++;
      continue;
    }

    const cleanName = String(rawName).trim();
    const cleanPrice = Number(String(rawPrice).replace(/[^0-9.]/g, ""));

    if (!cleanName || isNaN(cleanPrice)) {
      skippedCount++;
      continue;
    }

    if (existingNames.has(cleanName.toLowerCase())) {
      skippedCount++;
      continue;
    }

    // Category Logic
    let categoryId = null;
    if (rawCat) {
      const cleanCatName = String(rawCat).trim();
      const lowerCatName = cleanCatName.toLowerCase();

      if (categoryMap.has(lowerCatName)) {
        categoryId = categoryMap.get(lowerCatName);
      } else {
        // Create Category on the fly
        const { data: newCat } = await supabase
          .from("categories")
          .insert({ shop_id: shop.id, name: cleanCatName })
          .select("id")
          .single();

        if (newCat) {
          categoryMap.set(lowerCatName, newCat.id);
          categoryId = newCat.id;
        }
      }
    }

    toInsert.push({
      shop_id: shop.id,
      name: cleanName,
      price: cleanPrice,
      description: rawDesc,
      category_id: categoryId,
      status: "active",
      stock_count: 10, // Default stock for imports
      image_url: "",
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
    success: `Imported ${toInsert.length} products! (${skippedCount} skipped)`,
  };
}

// ==========================================
// 7. DUPLICATE PRODUCT
// ==========================================
export async function duplicateProductAction(
  formData: FormData,
): Promise<void> {
  const id = formData.get("id") as string;
  const supabase = await createClient();

  // 1. Fetch Original
  const { data: original, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!original) {
    throw new Error("Product not found");
  }

  // 2. Create Copy Payload
  const { id: _, created_at: __, ...rest } = original;

  const payload = {
    ...rest,
    name: `${original.name} (Copy)`,
    status: "draft",
    stock_count: 0,
    seo_title: original.seo_title ?? null,
    seo_description: original.seo_description ?? null,
  };

  // 3. Insert
  const { error: insertError } = await supabase
    .from("products")
    .insert(payload);

  if (insertError) {
    throw new Error(insertError.message);
  }

  revalidatePath("/products");
}

// ==========================================
// 8. BULK PRICE UPDATE (Admin Tool)
// ==========================================
export async function bulkPriceUpdateAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!shop) return { error: "Shop not found" };

  const operation = formData.get("operation") as "increase" | "decrease";
  const type = formData.get("type") as "percent" | "flat";
  const value = Number(formData.get("value"));
  const categoryId = formData.get("categoryId") as string;

  if (value <= 0) return { error: "Value must be positive" };

  let query = supabase
    .from("products")
    .select("id, price, name")
    .eq("shop_id", shop.id)
    .is("deleted_at", null);

  if (categoryId && categoryId !== "all") {
    query = query.eq("category_id", categoryId);
  }

  const { data: products } = await query;

  if (!products || products.length === 0)
    return { error: "No products found." };

  const updates = products.map((p) => {
    let newPrice = Number(p.price);
    const change = type === "percent" ? (newPrice * value) / 100 : value;

    if (operation === "increase") newPrice += change;
    else newPrice = Math.max(0, newPrice - change);

    return {
      id: p.id,
      name: p.name,
      price: Math.round(newPrice),
      shop_id: shop.id,
      // Updated_at handled by DB default usually, or explicit if needed
    };
  });

  const { error } = await supabase.from("products").upsert(updates);

  if (error) return { error: error.message };

  revalidatePath("/products");
  return { success: `Updated prices for ${updates.length} products!` };
}
