"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Verifying secure access...");

  useEffect(() => {
    const handleMagicLink = async () => {
      const supabase = createClient();

      // 1. Parse the Hash manually (Reliable way)
      // URL looks like: http://.../verify#access_token=xyz&refresh_token=abc...
      const hash = window.location.hash;
      
      if (!hash) {
        // If no hash, maybe Supabase already processed it? Check session.
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
           handleSuccess();
           return;
        }
        setStatus("No token found.");
        return;
      }

      // 2. Extract tokens
      const params = new URLSearchParams(hash.substring(1)); // remove #
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        setStatus("Invalid token format.");
        return;
      }

      // 3. FORCE SET SESSION
      setStatus("Switching accounts...");
      
      // First, sign out the Admin to clean state
      await supabase.auth.signOut();

      // Then, set the new User session
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
      
      // Force hard reload to clear any server-side caches
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