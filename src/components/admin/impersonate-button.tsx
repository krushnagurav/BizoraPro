// src/components/admin/impersonate-button.tsx
/*  * Impersonate Button Component
 * This component provides a button
 * for admin users to impersonate
 * another user, allowing them to
 * log in as that user for support
 * or troubleshooting purposes.
 */
"use client";

import { Button } from "@/components/ui/button";
import { impersonateUserAction } from "@/src/actions/admin-actions";
import { Loader2, UserCog } from "lucide-react";
import { useState } from "react";
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
