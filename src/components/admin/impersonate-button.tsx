"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCog, Loader2 } from "lucide-react";
import { impersonateUserAction } from "@/src/actions/admin-actions";
import { toast } from "sonner";

export function ImpersonateButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  const handleImpersonate = async () => {
    const confirm = window.confirm(
      "Are you sure? You will be logged out of Admin and logged in as this user.",
    );
    if (!confirm) return;

    setLoading(true);
    const res = await impersonateUserAction(userId);

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else if (res?.url) {
      toast.success("Redirecting to user dashboard...");
      // Force redirect to the magic link
      window.location.href = res.url;
    }
  };

  return (
    <Button
      onClick={handleImpersonate}
      disabled={loading}
      className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold gap-2"
    >
      {loading ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <UserCog className="h-4 w-4" />
      )}
      Impersonate
    </Button>
  );
}
