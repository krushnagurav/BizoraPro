// src/components/dashboard/marketing/lead-row-actions.tsx
/*  * Lead Row Actions Component
 * This component provides action
 * buttons for each lead in the
 * marketing dashboard, allowing
 * quick communication via WhatsApp
 * using predefined templates.
 */
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
import { logLeadContactAction } from "@/src/actions/marketing-actions";
import { MessageCircle } from "lucide-react";

interface LeadActionsProps {
  lead: any;
  shopName: string;
  templates: any[];
}

export function LeadRowActions({
  lead,
  shopName,
  templates,
}: LeadActionsProps) {
  const handleChat = async (template?: any) => {
    let text = "";

    if (template) {
      text = template.message || "";
      text = text.replace(/{{customer_name}}/g, lead.name || "there");
      text = text.replace(/{{shop_name}}/g, shopName);
    } else {
      text = `Hi ${lead.name || "there"}, thanks for subscribing to ${shopName}!`;
    }

    window.open(
      `https://wa.me/${lead.phone}?text=${encodeURIComponent(text)}`,
      "_blank",
    );

    await logLeadContactAction(lead.id);
  };

  return (
    <div className="flex justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            <MessageCircle className="h-4 w-4" /> Chat
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Choose Template</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleChat()}>
            Default Greeting
          </DropdownMenuItem>
          {templates.map((t) => (
            <DropdownMenuItem key={t.id} onClick={() => handleChat(t)}>
              {t.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
