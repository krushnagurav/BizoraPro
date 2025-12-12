"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Send, Check } from "lucide-react";
import { sendRecoveryNudgeAction } from "@/src/actions/retention-actions";
import { toast } from "sonner";

export function AtRiskShops({ shops }: { shops: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<string[]>([]);

  const handleNudge = async (shopId: string, ownerId: string) => {
    setLoadingId(shopId);
    const res = await sendRecoveryNudgeAction(shopId, ownerId);
    setLoadingId(null);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Recovery Nudge Sent!");
      setSentIds([...sentIds, shopId]);
    }
  };

  return (
    <Card className="bg-[#111] border-red-900/30 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <AlertTriangle className="text-red-500 h-5 w-5" />
          At Risk Shops (No Products)
        </CardTitle>
        <p className="text-xs text-gray-400">
          Shops created &gt;3 days ago with 0 products.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shops.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">
              All shops are healthy! 🎉
            </div>
          ) : (
            shops.map((shop) => {
              const daysOld = Math.floor(
                (new Date().getTime() - new Date(shop.created_at).getTime()) /
                  (1000 * 3600 * 24),
              );
              const isSent = sentIds.includes(shop.id);

              return (
                <div
                  key={shop.id}
                  className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-lg"
                >
                  <div>
                    <p className="font-bold text-sm text-red-200">
                      {shop.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] border-red-500/30 text-red-400 h-5"
                      >
                        {daysOld} days inactive
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isSent ? "outline" : "default"}
                    className={
                      isSent
                        ? "border-green-500/50 text-green-500"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }
                    disabled={isSent || loadingId === shop.id}
                    onClick={() => handleNudge(shop.id, shop.owner_id)}
                  >
                    {loadingId === shop.id ? (
                      "..."
                    ) : isSent ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
