import { createClient } from "@/src/lib/supabase/server";
import { Product } from "@/src/types/custom";

export const ITEMS_PER_PAGE = 10;

export async function getProducts(
  shopId: string,
  page: number = 1,
  query: string = "",
  categoryId: string = "all",
  status: string = "all"     
) {
  const supabase = await createClient();

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  try {
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
      console.error("DAL Error:", error);
      // Return empty typed array
      return { data: [] as Product[], metadata: { totalPages: 0, totalItems: 0, hasNextPage: false, hasPrevPage: false, page, limit: ITEMS_PER_PAGE } };
    }

    return {
      // Cast the response to your strict type
      data: (data as unknown as Product[]) || [],
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
    return { data: [] as Product[], metadata: { totalPages: 0, totalItems: 0, hasNextPage: false, hasPrevPage: false, page, limit: ITEMS_PER_PAGE } };
  }
}