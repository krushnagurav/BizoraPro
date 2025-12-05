import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toggleReviewStatusAction } from "@/src/actions/marketing-actions";
import { ReplyDialog } from "@/src/components/dashboard/marketing/reply-dialog";
import { ReviewsFilter } from "@/src/components/dashboard/marketing/reviews-filter"; // Import Filter
import { createClient } from "@/src/lib/supabase/server";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  MessageSquare,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; stars?: string; page?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "all";
  const starsFilter = params.stars || "all";
  const page = Number(params.page) || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  // 1. Build Query
  let query = supabase
    .from("product_reviews")
    .select("*, products(name, image_url)", { count: "exact" })
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (statusFilter === "pending") query = query.eq("is_approved", false);
  if (statusFilter === "approved") query = query.eq("is_approved", true);
  if (starsFilter !== "all") query = query.eq("rating", Number(starsFilter));

  const { data: reviews, count } = await query;

  // 2. Fetch Stats (Separate fast query)
  const { data: allReviews } = await supabase
    .from("product_reviews")
    .select("rating, is_approved")
    .eq("shop_id", shop?.id);

  const total = allReviews?.length || 0;
  const pending = allReviews?.filter((r) => !r.is_approved).length || 0;
  const critical = allReviews?.filter((r) => r.rating <= 3).length || 0;
  const avgRating =
    total > 0
      ? (allReviews?.reduce((acc, r) => acc + r.rating, 0) || 0) / total
      : 0;

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Star className="h-8 w-8" /> Reviews Center
          </h1>
          <p className="text-muted-foreground">
            Moderate feedback and build trust.
          </p>
        </div>
        <ReviewsFilter />
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Average</p>
              <p className="text-2xl font-bold text-yellow-500">
                {avgRating.toFixed(1)}
              </p>
            </div>
            <Star className="h-6 w-6 text-yellow-500 opacity-20" />
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <MessageSquare className="h-6 w-6 text-blue-500 opacity-20" />
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Pending</p>
              <p className="text-2xl font-bold text-orange-500">{pending}</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Critical
              </p>
              <p className="text-2xl font-bold text-red-500">{critical}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-500 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {/* REVIEW LIST */}
      <div className="grid gap-4">
        {reviews?.map((review) => (
          <Card
            key={review.id}
            className={`bg-card border-border/50 ${review.rating <= 3 ? "border-l-4 border-l-red-500" : ""}`}
          >
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-start">
                  {/* User Avatar */}
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {review.customer_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">
                        {review.customer_name}
                      </h3>
                      <div className="flex text-yellow-500">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>on</span>
                      <div className="flex items-center gap-1 bg-secondary/30 px-1.5 py-0.5 rounded">
                        {review.products?.image_url && (
                          <div className="relative w-3 h-3 rounded overflow-hidden">
                            <Image
                              src={review.products.image_url}
                              fill
                              className="object-cover"
                              alt=""
                            />
                          </div>
                        )}
                        <span className="font-medium text-foreground">
                          {review.products?.name || "Unknown Product"}
                        </span>
                      </div>
                      <span>
                        • {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant={review.is_approved ? "secondary" : "destructive"}
                >
                  {review.is_approved ? "Live" : "Pending"}
                </Badge>
              </div>

              <div className="ml-14">
                <p className="text-sm text-foreground bg-secondary/10 p-3 rounded-lg border border-border/50">
                  {review.comment}
                </p>

                {review.reply && (
                  <div className="mt-3 pl-3 border-l-2 border-primary/50">
                    <p className="text-xs font-bold text-primary mb-1">
                      Your Reply:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {review.reply}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
                <ReplyDialog
                  reviewId={review.id}
                  existingReply={review.reply}
                />
                {!review.is_approved && (
                  <form action={toggleReviewStatusAction}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="action" value="approve" />
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      <Check className="h-3 w-3" /> Approve
                    </Button>
                  </form>
                )}
                <form action={toggleReviewStatusAction}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="action" value="delete" />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-900/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No reviews matching filters.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <Link
              href={`/marketing/reviews?page=${page - 1}&status=${statusFilter}&stars=${starsFilter}`}
            >
              <Button variant="outline" size="sm" disabled={page <= 1}>
                <ArrowLeft className="h-4 w-4" /> Prev
              </Button>
            </Link>
            <Link
              href={`/marketing/reviews?page=${page + 1}&status=${statusFilter}&stars=${starsFilter}`}
            >
              <Button variant="outline" size="sm" disabled={page >= totalPages}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
