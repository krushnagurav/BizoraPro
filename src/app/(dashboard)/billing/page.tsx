import { createClient } from "@/src/lib/supabase/server";
import { PlanManager } from "@/src/components/dashboard/billing/plan-manager";
import { InvoiceList } from "@/src/components/dashboard/billing/invoice-list";
import { CreditCard, Receipt, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  // 1. Fetch Shop & Plan
  const { data: shop } = await supabase
    .from("shops")
    .select("id, plan, product_limit")
    .eq("owner_id", user.id)
    .single();

  // 2. Fetch Product Usage
  const { count } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })
    .eq("shop_id", shop?.id)
    .is("deleted_at", null);

  // 3. Fetch Invoices (Payments Table)
  const { data: invoices } = await supabase
    .from("payments")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <CreditCard className="h-8 w-8" /> Billing & Subscription
        </h1>
        <p className="text-muted-foreground">Manage your plan, payment methods, and invoices.</p>
      </div>

      {/* PLAN MANAGER (Upgrade UI) */}
      <PlanManager 
        currentPlan={shop?.plan || 'free'} 
        productCount={count || 0}
        productLimit={shop?.product_limit || 10}
      />

      {/* INVOICE SECTION */}
      <div className="space-y-4">
         <h2 className="text-xl font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" /> Billing History
         </h2>
         
         <InvoiceList invoices={invoices || []} />
      </div>
      
      {/* HELPER TEXT */}
      <div className="flex gap-3 items-start p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-muted-foreground">
         <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
         <div>
            <p className="text-white font-bold mb-1">Need help with billing?</p>
            <p>If you have questions about your invoice or want to cancel your subscription, please contact <span className="text-primary underline cursor-pointer">Support</span>.</p>
         </div>
      </div>

    </div>
  );
}