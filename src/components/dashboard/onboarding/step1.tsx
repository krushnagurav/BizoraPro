// src/components/dashboard/onboarding/step1.tsx
/*  * Step 1 Form Component
 * This component is used in the
 * onboarding process to collect
 * shop name and URL from the user.
 */
"use client";

import { completeStep1 } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Store, ArrowRight, Loader2, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

const RESERVED_SLUGS = [
  "admin",
  "dashboard",
  "login",
  "signup",
  "onboarding",
  "api",
  "auth",
  "settings",
  "profile",
  "billing",
  "support",
  "legal",
  "pricing",
  "contact",
  "about",
  "shop",
  "cart",
  "checkout",
];

export function Step1Form() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    if (!isSlugEdited) {
      setSlug(generateSlug(newName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(cleanValue);
    setIsSlugEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const finalSlug = generateSlug(slug);

    if (finalSlug.length < 3) {
      toast.error("Shop URL is too short.");
      setLoading(false);
      return;
    }

    if (RESERVED_SLUGS.includes(finalSlug)) {
      toast.error("This Shop URL is reserved. Please choose another.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", finalSlug);

    const res = await completeStep1(formData);

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(230,184,0,0.3)]">
          <Store className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Shop Name</Label>
        <Input
          name="name"
          value={name}
          onChange={handleNameChange}
          placeholder="e.g. UrbanCraft Market"
          className="bg-[#0A0A0A] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 flex items-center gap-2">
          Shop URL{" "}
          <span className="text-xs text-gray-500 font-normal">
            (Address customers will visit)
          </span>
        </Label>
        <div className="flex group focus-within:ring-1 focus-within:ring-primary/50 rounded-md">
          <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-white/10 bg-[#1A1A1A] text-gray-500 text-sm group-hover:bg-[#222] transition-colors">
            <LinkIcon className="w-3 h-3 mr-2 opacity-50" />
            bizorapro.com/
          </span>
          <Input
            name="slug"
            value={slug}
            onChange={handleSlugChange}
            placeholder="urbancraft-market"
            className="rounded-l-none bg-[#0A0A0A] border-white/10 h-12 text-white focus-visible:ring-0 border-l-0 pl-2"
            required
            minLength={3}
            maxLength={30}
          />
        </div>
        {!isSlugEdited && name.length > 0 && (
          <p className="text-[10px] text-gray-500 text-right">
            Auto-generated based on name
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 gap-2"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <>
            Next Step <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  );
}
