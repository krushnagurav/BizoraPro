// src/actions/product-actions.ts
/**
 * Product Actions.
 *
 * This file contains server-side actions for managing products,
 * including creating, updating, deleting, and importing products.
 */
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
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shop.id)
      .is("deleted_at", null);

    if (count && count >= shop.product_limit) {
      throw new Error(`Limit reached (${shop.product_limit}). Upgrade to Pro.`);
    }

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
      console.error("JSON Parse Error", e);
    }

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

    const { error } = await supabase.from("products").insert({
      shop_id: shop.id,
      name: parsedInput.name,
      price: parsedInput.price,
      sale_price: parsedInput.salePrice,
      category_id: categoryId,
      description: parsedInput.description,
      image_url: parsedInput.imageUrl || "",
      status: parsedInput.status || "active",

      seo_title: parsedInput.seoTitle,
      seo_description: parsedInput.seoDescription,

      variants: variantsData,
      gallery_images: galleryData,
      badges: badgesData,
      product_skus: skusData,
      stock_count: finalStock,
    });

    if (error) throw new Error(error.message);

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
      status: parsedInput.status,

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

    let redirectTo: string | undefined;
    try {
      const productId = parsedInput.id as string | undefined;
      if (parsedInput.status === "active" && productId) {
        redirectTo = `/products/${productId}`;
      } else {
        redirectTo = "/products";
      }
    } catch (e) {
      redirectTo = undefined;
    }

    revalidatePath("/products");

    return { success: true, redirect: redirectTo };
  });

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

export async function importProductsAction(products: any[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  const { data: shop } = await supabase
    .from("shops")
    .select("id, product_limit, plan")
    .eq("owner_id", user.id)
    .single();

  if (!shop) return { error: "Shop not found" };

  if (shop.plan !== "pro") {
    return { error: "Bulk Import is a Pro feature." };
  }

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

  const toInsert = [];
  let skippedCount = 0;

  for (const item of products) {
    const safeItem: any = {};
    Object.keys(item).forEach((k) => {
      safeItem[k.toLowerCase().replace(/[^a-z]/g, "")] = item[k];
    });

    const rawName = safeItem.name || safeItem.productname || safeItem.title;
    const rawPrice = safeItem.price || safeItem.sellingprice || safeItem.mrp;
    const rawDesc = safeItem.description || safeItem.desc || "";
    const rawCat = safeItem.category || safeItem.categoryname;

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

    let categoryId = null;
    if (rawCat) {
      const cleanCatName = String(rawCat).trim();
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
      stock_count: 10,
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

export async function duplicateProductAction(
  formData: FormData,
): Promise<void> {
  const id = formData.get("id") as string;
  const supabase = await createClient();

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

  const { id: _, created_at: __, ...rest } = original;

  const payload = {
    ...rest,
    name: `${original.name} (Copy)`,
    status: "draft",
    stock_count: 0,
    seo_title: original.seo_title ?? null,
    seo_description: original.seo_description ?? null,
  };

  const { error: insertError } = await supabase
    .from("products")
    .insert(payload);

  if (insertError) {
    throw new Error(insertError.message);
  }

  revalidatePath("/products");
}

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
    };
  });

  const { error } = await supabase.from("products").upsert(updates);

  if (error) return { error: error.message };

  revalidatePath("/products");
  return { success: `Updated prices for ${updates.length} products!` };
}
