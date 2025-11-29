import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toggleReviewStatusAction } from "@/src/actions/marketing-actions";
import { ReplyDialog } from "@/src/components/dashboard/marketing/reply-dialog";
import { createClient } from "@/src/lib/supabase/server";
import { AlertTriangle, Check, MessageSquare, Star, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user!.id).single();

  // Fetch Reviews
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("*, products(name, image_url)")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  // Calculate Stats
  const total = reviews?.length || 0;
  const pending = reviews?.filter(r => !r.is_approved).length || 0;
  const critical = reviews?.filter(r => r.rating <= 3).length || 0;
  const avgRating = total > 0 
    ? (reviews?.reduce((acc, r) => acc + r.rating, 0) || 0) / total 
    : 0;

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Star className="h-8 w-8" /> Reviews Center
        </h1>
        <p className="text-muted-foreground">Moderate feedback and build trust.</p>
      </div>

      {/* 📊 1. SUMMARY STATS */}
      <div className="grid grid-cols-4 gap-4">
         <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
               <div><p className="text-xs text-muted-foreground uppercase">Average</p><p className="text-2xl font-bold text-yellow-500">{avgRating.toFixed(1)}</p></div>
               <Star className="h-6 w-6 text-yellow-500 opacity-20" />
            </CardContent>
         </Card>
         <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
               <div><p className="text-xs text-muted-foreground uppercase">Total</p><p className="text-2xl font-bold">{total}</p></div>
               <MessageSquare className="h-6 w-6 text-blue-500 opacity-20" />
            </CardContent>
         </Card>
         <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
               <div><p className="text-xs text-muted-foreground uppercase">Pending</p><p className="text-2xl font-bold text-orange-500">{pending}</p></div>
               <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            </CardContent>
         </Card>
         <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
               <div><p className="text-xs text-muted-foreground uppercase">Critical</p><p className="text-2xl font-bold text-red-500">{critical}</p></div>
               <AlertTriangle className="h-6 w-6 text-red-500 opacity-20" />
            </CardContent>
         </Card>
      </div>

      {/* 📝 2. REVIEW LIST */}
      <div className="grid gap-4">
        {reviews?.map((review) => (
          <Card key={review.id} className={`bg-card border-border/50 ${review.rating <= 3 ? 'border-l-4 border-l-red-500' : ''}`}>
            <CardContent className="p-6 flex flex-col gap-4">
              
              {/* Top Row: Product & Rating */}
              <div className="flex justify-between items-start">
                 <div className="flex gap-4 items-center">
                    {/* Product Thumb */}
                    <div className="h-12 w-12 bg-secondary rounded-md relative overflow-hidden border border-border">
                       {review.products?.image_url && <Image src={review.products.image_url} fill className="object-cover" alt="" unoptimized />}
                    </div>
                    <div>
                       <h3 className="font-bold text-sm">{review.customer_name}</h3>
                       <p className="text-xs text-muted-foreground">on <span className="text-foreground">{review.products?.name}</span></p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                       {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <Badge variant={review.is_approved ? "secondary" : "destructive"}>
                      {review.is_approved ? "Live" : "Pending"}
                    </Badge>
                 </div>
              </div>

              {/* Comment */}
              <div className="bg-secondary/20 p-3 rounded-lg text-sm text-foreground">
                 {review.comment}
              </div>
              
              {/* Owner Reply */}
              {review.reply && (
                 <div className="ml-8 p-3 bg-primary/10 border-l-2 border-primary rounded-r-lg text-sm">
                    <p className="text-xs font-bold text-primary mb-1">Your Reply:</p>
                    <p className="text-muted-foreground">"{review.reply}"</p>
                 </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
                <ReplyDialog reviewId={review.id} existingReply={review.reply} />
                
                {!review.is_approved && (
                  <form action={toggleReviewStatusAction}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="action" value="approve" />
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                      <Check className="h-3 w-3" /> Approve
                    </Button>
                  </form>
                )}
                
                <form action={toggleReviewStatusAction}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="action" value="delete" />
                  <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-900/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>

            </CardContent>
          </Card>
        ))}
        
        {reviews?.length === 0 && (
           <div className="text-center py-12 text-muted-foreground">No reviews yet. Share your shop link!</div>
        )}
      </div>
    </div>
  );
}