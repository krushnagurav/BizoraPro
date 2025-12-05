"use client";

import { useState, useEffect } from "react";
import { updateStorePoliciesAction } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  RotateCcw,
  Lock,
  Wand2,
  Eye,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";
import { POLICY_TEMPLATES } from "@/src/lib/policy-templates";
import Link from "next/link";

export default function PoliciesPage() {
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState<any>(null);

  // State for inputs
  const [refund, setRefund] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [terms, setTerms] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("shops")
          .select("name, slug, policies")
          .eq("owner_id", user.id)
          .single();
        setShop(data);
        if (data?.policies) {
          setRefund(data.policies.refund || "");
          setPrivacy(data.policies.privacy || "");
          setTerms(data.policies.terms || "");
        }
      }
    };
    fetchShop();
  }, []);

  const handleGenerate = (type: "refund" | "privacy" | "terms") => {
    if (!shop) return;
    if (!confirm("This will overwrite your current text. Continue?")) return;

    const text = POLICY_TEMPLATES[type](shop.name);
    if (type === "refund") setRefund(text);
    if (type === "privacy") setPrivacy(text);
    if (type === "terms") setTerms(text);
    toast.success("Template generated!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("refund", refund);
    formData.append("privacy", privacy);
    formData.append("terms", terms);

    const result = await updateStorePoliciesAction(formData);
    setLoading(false);

    if (result?.error) toast.error(result.error);
    else toast.success("Policies updated!");
  };

  if (!shop) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-8 w-8" /> Store Policies
          </h1>
          <p className="text-muted-foreground">
            Define rules to build trust with your customers.
          </p>
        </div>
        <Link href={`/${shop.slug}/legal`} target="_blank">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" /> View Live Page
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="refund" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border/50">
            <TabsTrigger value="refund" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Refund Policy
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Lock className="h-4 w-4" /> Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="gap-2">
              <ShieldCheck className="h-4 w-4" /> Terms of Service
            </TabsTrigger>
          </TabsList>

          {/* Refund Tab */}
          <TabsContent value="refund">
            <Card className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Return & Refund Policy</CardTitle>
                  <CardDescription>
                    Explain how customers can return items.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleGenerate("refund")}
                  className="gap-2 text-xs"
                >
                  <Wand2 className="h-3 w-3" /> Use Template
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={refund}
                  onChange={(e) => setRefund(e.target.value)}
                  className="min-h-[300px] font-mono text-sm leading-relaxed"
                  placeholder="Enter your policy details..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Privacy Policy</CardTitle>
                  <CardDescription>
                    How you handle customer data.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleGenerate("privacy")}
                  className="gap-2 text-xs"
                >
                  <Wand2 className="h-3 w-3" /> Use Template
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="min-h-[300px] font-mono text-sm leading-relaxed"
                  placeholder="Enter your policy details..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms Tab */}
          <TabsContent value="terms">
            <Card className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Terms of Service</CardTitle>
                  <CardDescription>
                    General rules for using your shop.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleGenerate("terms")}
                  className="gap-2 text-xs"
                >
                  <Wand2 className="h-3 w-3" /> Use Template
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="min-h-[300px] font-mono text-sm leading-relaxed"
                  placeholder="Enter your policy details..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button
              size="lg"
              className="font-bold bg-primary text-black hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Save Policies"
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
}
