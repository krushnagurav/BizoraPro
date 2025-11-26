import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, Trash2, MessageSquare } from "lucide-react";
import { toggleReviewStatusAction } from "@/src/actions/marketing-actions";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user!.id).single();
  

  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("*, products(name, image_url)")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Star className="h-8 w-8" /> Reviews
        </h1>
        <p className="text-muted-foreground">Moderate customer feedback.</p>
      </div>

      <div className="grid gap-4">
        {reviews?.map((review) => (
          <Card key={review.id} className="bg-card border-border/50">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <Badge variant={review.is_approved ? "secondary" : "destructive"}>
                      {review.is_approved ? "Live" : "Pending"}
                    </Badge>
                    <span className="font-bold">{review.customer_name}</span>
                    <span className="text-muted-foreground text-sm">on {review.products?.name}</span>
                 </div>
                 <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                 </div>
                 <p className="text-sm">{review.comment}</p>
              </div>

              <div className="flex gap-2">
                {!review.is_approved && (
                  <form action={toggleReviewStatusAction}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="action" value="approve" />
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                  </form>
                )}
                <form action={toggleReviewStatusAction}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="action" value="delete" />
                  <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-900/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews?.length === 0 && <p className="text-center text-muted-foreground">No reviews yet.</p>}
      </div>
    </div>
  );
}