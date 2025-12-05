import { createSafeActionClient } from "next-safe-action";
import { createClient } from "@/src/lib/supabase/server";

export const action = createSafeActionClient({
  handleServerError(e) {
    console.error("Action Error:", e.message);
    return "An unexpected error occurred.";
  },
});

// Authenticated Action Wrapper
export const authAction = action.use(async ({ next }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return next({ ctx: { user, supabase } });
});
