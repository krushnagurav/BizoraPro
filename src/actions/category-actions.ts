"use server";

import { authAction } from "@/src/lib/safe-action";
import { categorySchema } from "@/src/lib/validators/category";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. CREATE / UPDATE CATEGORY
export const upsertCategoryAction = authAction
  .schema(categorySchema)
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("owner_id", user.id)
      .single();
    if (!shop) throw new Error("Shop not found");

    const payload = {
      shop_id: shop.id,
      name: parsedInput.name,
      slug: parsedInput.slug,
      image_url: parsedInput.imageUrl,
      status: parsedInput.status,
    };

    if (parsedInput.id) {
      // UPDATE
      const { error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", parsedInput.id)
        .eq("shop_id", shop.id); // Security check

      if (error) throw new Error(error.message);
    } else {
      // CREATE
      // Check if slug exists
      const { data: existing } = await supabase
        .from("categories")
        .select("id")
        .eq("shop_id", shop.id)
        .eq("slug", parsedInput.slug)
        .single();

      if (existing) throw new Error("A category with this URL already exists.");

      const { error } = await supabase.from("categories").insert(payload);
      if (error) throw new Error(error.message);
    }

    revalidatePath("/categories");
    return {
      success: true,
      message: parsedInput.id ? "Category Updated" : "Category Created",
    };
  });

// 2. DELETE CATEGORY (With Protection)
const deleteSchema = z.object({ id: z.string().uuid() });

export const deleteCategoryAction = authAction
  .schema(deleteSchema)
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    // A. Security Check
    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("owner_id", user.id)
      .single();
    if (!shop) throw new Error("Unauthorized");

    // B. Protection Check: Does it have products?
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", parsedInput.id)
      .is("deleted_at", null); // Only check active products

    if (count && count > 0) {
      throw new Error(
        `Cannot delete: This category has ${count} active products. Please move or delete them first.`
      );
    }

    // C. Delete
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", parsedInput.id)
      .eq("shop_id", shop.id);

    if (error) throw new Error(error.message);

    revalidatePath("/categories");
    return { success: true, message: "Category deleted" };
  });
