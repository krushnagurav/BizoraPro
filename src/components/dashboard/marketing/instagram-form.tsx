// src/components/dashboard/marketing/instagram-form.tsx
/*  * Instagram Form Component
 * This component allows users
 * to update their Instagram feed
 * gallery in the marketing dashboard.
 * Users can upload multiple images
 * which will be displayed in their
 * public shop.
 */
"use client";

import { useState } from "react";
import { updateInstagramFeedAction } from "@/src/actions/marketing-actions";
import { MultiImageUpload } from "@/src/components/dashboard/multi-image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function InstagramForm({ initialFeed }: { initialFeed: string[] }) {
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<string[]>(initialFeed);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("feed", JSON.stringify(feed));

    const result = await updateInstagramFeedAction(formData);
    setLoading(false);

    if (result?.error) toast.error(result.error);
    else toast.success("Feed updated!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Your Feed Gallery</CardTitle>
          <CardDescription>
            Select up to 6 images. These will appear at the bottom of your
            public shop.
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
  );
}
