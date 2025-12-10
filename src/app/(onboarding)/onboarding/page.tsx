// src/app/(onboarding)/onboarding/page.tsx
/*
 * Onboarding Main Page
 *
 * This page serves as the main entry point for the onboarding process.
 * It determines the current step of the onboarding and renders the appropriate form.
 */
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Step1Form } from "@/src/components/dashboard/onboarding/step1";
import { Step2Form } from "@/src/components/dashboard/onboarding/step2";
import { Step3Form } from "@/src/components/dashboard/onboarding/step3";
import { createClient } from "@/src/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("onboarding_step")
    .eq("owner_id", user.id)
    .single();

  const currentStep = shop ? shop.onboarding_step : 1;

  if (currentStep >= 4) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/20">
      <Card className="w-full max-w-lg border-white/10 bg-[#111] shadow-2xl shadow-black">
        <CardHeader className="text-center border-b border-white/5 pb-6">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 w-12 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl">
            {currentStep === 1 && "Name your Shop"}
            {currentStep === 2 && "Contact & Category"}
            {currentStep === 3 && "Add First Product"}
          </CardTitle>
          <CardDescription>Step {currentStep} of 3</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {currentStep === 1 && <Step1Form />}
          {currentStep === 2 && <Step2Form />}
          {currentStep === 3 && <Step3Form />}
        </CardContent>
      </Card>
    </div>
  );
}
