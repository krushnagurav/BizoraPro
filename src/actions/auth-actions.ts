// src\actions\auth-actions.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../lib/supabase/server";

// 1. Define Validation Schemas (Security Best Practice)
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 chars" }),
});

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 chars" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 chars" }),
});

const ADMIN_EMAIL = "krishna@bizorapro.com";

// 2. Login Action
export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData);

  // Validate Input
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid login data" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // If successful, redirect to Dashboard
  // CHECK: Is this the Super Admin?
  if (parsed.data.email === ADMIN_EMAIL) {
    redirect("/admin"); // Go to Command Center
  }

  // Normal User -> Go to Dashboard
  redirect("/dashboard");
}

// 3. Signup Action
export async function signupAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  // Validate Input
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid signup data" };
  }
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

// CHECK: Is this the Super Admin?
  if (parsed.data.email === ADMIN_EMAIL) {
    redirect("/admin"); // Skip onboarding, go to Admin
  }

  // Normal User -> Go to Onboarding
  redirect("/onboarding");
}

// 4. Logout Action
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// 5. Forgot Password Action
export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email is required" };

  const supabase = await createClient();

  // This sends a "Magic Link" to the user's email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Where to send them after they click the link in email
    // We will build this /reset-password page in Phase 4, but defining the link now is good practice.
    // It should look like this:
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for the reset link!" };
}

// 6. Reset Password (The Actual Update)
export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirmPassword") as string;

  if (!password || !confirm) return { error: "Both fields are required" };
  if (password !== confirm) return { error: "Passwords do not match" };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters" };

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}


// 7. UPDATE PROFILE
export async function updateProfileAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;

  const supabase = await createClient();
  
  // 1. Update Auth User (Metadata)
  const { error: userError } = await supabase.auth.updateUser({
    email: email, // This triggers a confirmation email to the new address
    data: { full_name: fullName }
  });

  if (userError) return { error: userError.message };

  return { success: "Profile updated. If you changed email, check your inbox." };
}