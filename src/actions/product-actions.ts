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
  variants: z.string().optional(),
  galleryImages: z.string().optional(),
  badges: z.string().optional(),
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
    variants: formData.get("variants"),
    galleryImages: formData.get("galleryImages"),
    badges: formData.get("badges"),
  };

  const parsed = productSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let variantsData = [];
  try {
    if (parsed.data.variants) {
      variantsData = JSON.parse(parsed.data.variants);
    }
  } catch (e) {
    console.error("JSON Parse Error:", e);
  }

  const galleryData = rawData.galleryImages ? JSON.parse(rawData.galleryImages as string) : [];
const badgesData = rawData.badges ? JSON.parse(rawData.badges as string) : [];

  // 4. Insert
  const { error } = await supabase.from("products").insert({
    shop_id: shop.id,
    name: parsed.data.name,
    price: parsed.data.price,
    sale_price: parsed.data.salePrice,
    category_id: parsed.data.category,
    description: parsed.data.description,
    image_url: parsed.data.imageUrl || "",
    status: 'active',
    variants: variantsData,
    gallery_images: galleryData,
    badges: badgesData,
  });

  if (error) {
    return { error: error.message };
  }

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
  
  const rawData = {
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || null,
    category: formData.get("category"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    variants: formData.get("variants"),
    galleryImages: formData.get("galleryImages"),
    badges: formData.get("badges"),
  };

  const parsed = updateSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Parse Variants
  let variantsData = [];
  try {
    if (parsed.data.variants) {
      variantsData = JSON.parse(parsed.data.variants);
    }
  } catch (e) { console.error(e) }

  const updates: any = {
    name: parsed.data.name,
    price: parsed.data.price,
    sale_price: parsed.data.salePrice,
    category_id: parsed.data.category,
    description: parsed.data.description,
    variants: variantsData,
    gallery_images: rawData.galleryImages ? JSON.parse(rawData.galleryImages as string) : [],
    badges: rawData.badges ? JSON.parse(rawData.badges as string) : [],
  };

  if (parsed.data.imageUrl && parsed.data.imageUrl.length > 0) {
    updates.image_url = parsed.data.imageUrl;
  }

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

// ==========================================
// ACTION: SMART BULK IMPORT
// ==========================================
export async function importProductsAction(products: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Login required" };

  // 1. Get Shop & Current Usage
  const { data: shop } = await supabase
    .from("shops")
    .select("id, product_limit")
    .eq("owner_id", user.id)
    .single();

  if (!shop) return { error: "Shop not found" };

  // 2. Fetch Existing Data (To prevent duplicates)
  // We fetch ALL product names to check for duplicates in memory (faster than DB queries per row)
  const { data: existingProducts } = await supabase
    .from("products")
    .select("name")
    .eq("shop_id", shop.id)
    .is("deleted_at", null); // Only check active products

  // Create a Set for fast lookup (e.g., "red shirt" -> true)
  const existingNames = new Set(existingProducts?.map(p => p.name.toLowerCase().trim()));

  // 3. Fetch Categories
  let { data: existingCats } = await supabase
    .from("categories")
    .select("id, name")
    .eq("shop_id", shop.id);

  // Helper map for categories (Name -> ID)
  const categoryMap = new Map<string, string>();
  existingCats?.forEach(c => categoryMap.set(c.name.toLowerCase(), c.id));

  // 4. PROCESS ROWS
  const toInsert = [];
  let skippedCount = 0;
  let newCategoriesCount = 0;

  for (const item of products) {
    // A. Basic Validation
    if (!item.Name || !item.Price) {
      skippedCount++;
      continue;
    }

    const cleanName = item.Name.trim();
    
    // B. Duplicate Check
    if (existingNames.has(cleanName.toLowerCase())) {
      skippedCount++; // Skip duplicates
      continue;
    }

    // C. Price Cleaning (Handle "$1,000", "100.00", etc.)
    const cleanPrice = Number(item.Price.toString().replace(/[^0-9.]/g, ""));
    if (isNaN(cleanPrice)) {
      skippedCount++;
      continue;
    }

    // D. Category Logic (Auto-Create)
    let categoryId = null;
    if (item.Category) {
      const cleanCatName = item.Category.trim();
      const lowerCatName = cleanCatName.toLowerCase();

      if (categoryMap.has(lowerCatName)) {
        // Found existing ID
        categoryId = categoryMap.get(lowerCatName);
      } else {
        // Create NEW Category immediately
        const { data: newCat } = await supabase
          .from("categories")
          .insert({ shop_id: shop.id, name: cleanCatName })
          .select("id")
          .single();
        
        if (newCat) {
          categoryMap.set(lowerCatName, newCat.id); // Add to map so next row finds it
          categoryId = newCat.id;
          newCategoriesCount++;
        }
      }
    }

    // E. Add to Batch
    toInsert.push({
      shop_id: shop.id,
      name: cleanName,
      price: cleanPrice,
      description: item.Description || "",
      category_id: categoryId,
      status: 'active',
      image_url: "" 
    });
    
    // Add to Set so we don't duplicate within the CSV itself
    existingNames.add(cleanName.toLowerCase());
  }

  // 5. Check Limits Before Inserting
  const currentTotal = existingProducts?.length || 0;
  if (currentTotal + toInsert.length > shop.product_limit) {
    return { error: `Limit reached! You can only add ${shop.product_limit - currentTotal} more items.` };
  }

  if (toInsert.length === 0) {
    return { success: `No new products added. (${skippedCount} duplicates/invalid skipped)` };
  }

  // 6. Bulk Insert
  const { error } = await supabase.from("products").insert(toInsert);

  if (error) return { error: error.message };

  revalidatePath("/products");
  return { 
    success: `Imported ${toInsert.length} products! (Skipped ${skippedCount} duplicates, Created ${newCategoriesCount} new categories)` 
  };
}