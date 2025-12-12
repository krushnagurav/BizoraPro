// src/actions/auth-actions.ts
/**
 * Authentication Actions.
 *
 * This file contains server-side actions for handling user authentication,
 * including login, signup, logout, password reset, and profile updates.
 */
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../lib/supabase/server";

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

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData);

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

  const destination =
    parsed.data.email === ADMIN_EMAIL ? "/admin" : "/dashboard";
  return { success: true, redirectUrl: destination };
}

export async function signupAction(formData: FormData) {
  const data = Object.fromEntries(formData);

  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid signup data" };
  }
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signUp({
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

  if (!authData.session) {
    return { success: true, requireVerify: true };
  }

  const destination =
    parsed.data.email === ADMIN_EMAIL ? "/admin" : "/onboarding";
  return { success: true, requireVerify: false, redirectUrl: destination };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email is required" };

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for the reset link!" };
}

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

export async function updateProfileAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;

  const supabase = await createClient();

  const { error: userError } = await supabase.auth.updateUser({
    email: email,
    data: { full_name: fullName },
  });

  if (userError) return { error: userError.message };

  return {
    success: "Profile updated. If you changed email, check your inbox.",
  };
}
