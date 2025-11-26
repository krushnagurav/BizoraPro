"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { updateInstagramFeedAction } from "@/src/actions/marketing-actions";
import { MultiImageUpload } from "@/src/components/dashboard/multi-image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Instagram } from "lucide-react";

export default function InstagramPage() {
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // 1. Fetch existing feed
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("shops")
          .select("instagram_feed")
          .eq("owner_id", user.id)
          .single();
        
        if (data?.instagram_feed) {
          setFeed(data.instagram_feed as string[]);
        }
      }
      setIsFetching(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("feed", JSON.stringify(feed));

    const result = await updateInstagramFeedAction(formData);
    
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Instagram feed updated!");
    }
  };

  if (isFetching) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Instagram className="h-8 w-8" /> Instagram Integration
        </h1>
        <p className="text-muted-foreground">
          Upload your best photos to show a "Live Feed" on your shop.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Your Feed Gallery</CardTitle>
            <CardDescription>
              Select up to 6 images. These will appear at the bottom of your public shop to build trust.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultiImageUpload 
              value={feed} 
              onChange={setFeed} 
              disabled={loading}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" className="font-bold" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Feed"}
          </Button>
        </div>
      </form>
    </div>
  );
}