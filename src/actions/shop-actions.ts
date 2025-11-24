"use server";


import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- STEP 1 VALIDATION ---
const step1Schema = z.object({
  name: z.string().min(3, "Shop name too short"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Invalid URL format"),
});

// --- STEP 2 VALIDATION ---
const step2Schema = z.object({
  whatsapp: z.string().min(10, "Invalid Phone Number"), // We'll strip non-digits later
  category: z.string().min(2, "Please select a category"),
});

// --- STEP 3 VALIDATION ---
const step3Schema = z.object({
  productName: z.string().min(2),
  productPrice: z.string().transform((val) => Number(val)),
  // Image handling happens on client usually, but for MVP we'll handle the text data here
});

// ==========================================
// ACTION 1: CREATE SHOP (Step 1)
// ==========================================
export async function completeStep1(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Login required" };

  const raw = { name: formData.get("name"), slug: formData.get("slug") };
  const parsed = step1Schema.safeParse(raw);
  
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  // Check slug uniqueness
  const { data: exists } = await supabase.from("shops").select("id").eq("slug", parsed.data.slug).single();
  if (exists) return { error: "URL already taken" };

  const { error } = await supabase.from("shops").insert({
    owner_id: user.id,
    name: parsed.data.name,
    slug: parsed.data.slug,
    onboarding_step: 2 // Advance to Step 2
  });

  if (error) return { error: error.message };
  
  // Stay on onboarding page to show Step 2
  redirect("/onboarding");
}

// ==========================================
// ACTION 2: WA & CATEGORY (Step 2)
// ==========================================
export async function completeStep2(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const raw = { 
    whatsapp: formData.get("whatsapp"), 
    category: formData.get("category") 
  };
  const parsed = step2Schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  // 1. Create the Category in DB first
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();
  if (!shop) return { error: "Shop not found" };

  const { data: newCat, error: catError } = await supabase
    .from("categories")
    .insert({ shop_id: shop.id, name: parsed.data.category })
    .select("id")
    .single();

  if (catError) return { error: "Failed to save category" };

  // 2. Update Shop with WA number (Using theme_config for now or a metadata column, 
  // let's assume we save it to a 'contact_phone' column if it exists, 
  // OR better: create a 'whatsapp_number' column in shops table if we missed it.
  // For MVP, let's assume we forgot the column and add it via SQL or store in metadata. 
  // *QUICK FIX*: Let's run a SQL command later to add 'whatsapp_number' to shops.*
  
  // Updating onboarding step
  const { error } = await supabase
    .from("shops")
    .update({ 
      whatsapp_number: parsed.data.whatsapp,
      onboarding_step: 3 
    })
    .eq("id", shop.id);

  if (error) return { error: error.message };

  redirect("/onboarding");
}

// ==========================================
// ACTION 3: FIRST PRODUCT (Step 3)
// ==========================================
export async function completeStep3(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get Shop
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();
  
  const name = formData.get("productName") as string;
  const price = Number(formData.get("productPrice"));
  // Note: Image upload logic usually requires client-side handling or a separate bucket upload.
  // For this "Speed Run", we will skip the image upload in this specific action 
  // and just create a placeholder product.

  const { error } = await supabase.from("products").insert({
    shop_id: shop.id,
    name: name,
    price: price,
    status: 'active',
    image_url: "" // Empty for now
  });

  if (error) return { error: error.message };

  // FINISH ONBOARDING
  await supabase.from("shops").update({ onboarding_step: 4 }).eq("id", shop.id);

  redirect("/dashboard");
}

// --- THEME & SETTINGS ACTIONS ---

export async function updateShopAppearanceAction(formData: FormData) {
  const bannerUrl = formData.get("bannerUrl") as string;
  const primaryColor = formData.get("primaryColor") as string;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  // Update Shop
  const { error } = await supabase
    .from("shops")
    .update({
      theme_config: {
        primaryColor: primaryColor || "#E6B800",
        bannerUrl: bannerUrl || "",
      }
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  return { success: "Shop appearance updated!" };
}


export async function updateShopSettingsAction(formData: FormData) {
  const isOpen = formData.get("isOpen") === "on"; // Checkbox returns "on" if checked
  const minOrder = Number(formData.get("minOrder"));
  const deliveryNote = formData.get("deliveryNote") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  const { error } = await supabase
    .from("shops")
    .update({
      is_open: isOpen,
      min_order_value: minOrder,
      delivery_note: deliveryNote
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: "Settings updated" };
}