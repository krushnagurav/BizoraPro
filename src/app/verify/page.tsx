// src/app/verify/page.tsx
/*  * Verify Page
 *
 * This page handles the verification of secure access via magic links.
 * It processes tokens from the URL hash to authenticate users and redirect them accordingly.
 */
"use client";

import { createClient } from "@/src/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Verifying secure access...");

  useEffect(() => {
    const handleMagicLink = async () => {
      const supabase = createClient();

      const hash = window.location.hash;

      if (!hash) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          handleSuccess();
          return;
        }
        setStatus("No token found.");
        return;
      }

      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        setStatus("Invalid token format.");
        return;
      }

      setStatus("Switching accounts...");

      await supabase.auth.signOut();

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        console.error("Session Error:", error);
        setStatus("Failed to establish session.");
        toast.error(error.message);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        handleSuccess();
      }
    };

    const handleSuccess = () => {
      setStatus("Access granted. Redirecting...");
      toast.success("Impersonation active!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    };

    handleMagicLink();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-gray-400 animate-pulse">{status}</p>
    </div>
  );
}
