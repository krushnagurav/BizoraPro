import { createClient } from "@/src/lib/supabase/server";

export const ITEMS_PER_PAGE = 10;

export async function getProducts(
  shopId: string,
  page: number = 1,
  query: string = ""
) {
  const supabase = await createClient();

  // 1. Calculate Range (Pagination Logic)
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  try {
    // 2. Build Query
    let dbQuery = supabase
      .from("products")
      .select("*", { count: "exact" }) // Get total count
      .eq("shop_id", shopId)
      .is("deleted_at", null) // Only Active Products
      .order("created_at", { ascending: false })
      .range(from, to);

    // 3. Apply Search
    if (query) {
      dbQuery = dbQuery.ilike("name", `%${query}%`);
    }

    const { data, count, error } = await dbQuery;

    if (error) {
      console.error("DAL Error:", error);
      return { data: [], metadata: { totalPages: 0, totalItems: 0, hasNext: false, hasPrev: false } };
    }

    // 4. Return Data + Metadata
    return {
      data: data || [],
      metadata: {
        page,
        limit: ITEMS_PER_PAGE,
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        hasNextPage: (count || 0) > to + 1,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("System Error:", error);
    return { data: [], metadata: { totalPages: 0, totalItems: 0, hasNext: false, hasPrev: false } };
  }
}