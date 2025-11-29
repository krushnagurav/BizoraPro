"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { incrementTemplateUsageAction } from "@/src/actions/marketing-actions";
import { ChevronDown, MessageCircle } from "lucide-react";

interface TemplateSelectorProps {
  templates: any[];
  order: any;
  shopName: string;
}

export function TemplateSelector({ templates, order, shopName }: TemplateSelectorProps) {
  
  const handleSelect = async (template: any) => {
    let text = template.message || "";

    // 🪄 MAGIC: Replace Variables
    text = text.replace(/{{customer_name}}/g, order.customer_info?.name || "Customer");
    text = text.replace(/{{order_id}}/g, `#${order.id.slice(0, 5).toUpperCase()}`);
    text = text.replace(/{{amount}}/g, `₹${order.total_amount}`);
    text = text.replace(/{{shop_name}}/g, shopName);
    // Add more replacements as needed (e.g. tracking link)

    // Open WhatsApp
    const phone = order.customer_info?.phone;
    if (phone) {
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
        // Track usage
        await incrementTemplateUsageAction(template.id);
    }
  };

  // Group templates by category for nicer UI
  const categories = Array.from(new Set(templates.map(t => t.category || 'general')));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
           <MessageCircle className="h-4 w-4" /> 
           WhatsApp
           <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Choose Template</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {templates.length === 0 && (
            <div className="p-2 text-xs text-muted-foreground text-center">
                No templates found. <br/> Go to Marketing to create one.
            </div>
        )}

        {categories.map(cat => (
           <div key={cat}>
             <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">
               {cat}
             </div>
             {templates.filter(t => t.category === cat).map(t => (
               <DropdownMenuItem 
                 key={t.id} 
                 onClick={() => handleSelect(t)}
                 className="cursor-pointer"
               >
                 {t.name}
               </DropdownMenuItem>
             ))}
           </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}