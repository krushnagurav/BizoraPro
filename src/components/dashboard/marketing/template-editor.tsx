"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTemplateAction, updateTemplateAction } from "@/src/actions/marketing-actions";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Available variables
const VARIABLES = [
  { label: "Customer Name", value: "{{customer_name}}" },
  { label: "Order ID", value: "{{order_id}}" },
  { label: "Total Amount", value: "{{amount}}" },
  { label: "Shop Name", value: "{{shop_name}}" },
  { label: "Tracking Link", value: "{{link}}" },
];

export function TemplateEditor({ initialData, onClose }: { initialData?: any, onClose?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(initialData?.message || "");

  const insertVariable = (val: string) => {
    setMessage((prev: string) => `${prev} ${val}`.trim());
  };

  // Reset when initialData changes (for switching between templates)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialData) setMessage(initialData.message);
    else setMessage("");
  }, [initialData]);

  // Live Preview Logic
  const previewText = message
    .replace("{{customer_name}}", "Rahul")
    .replace("{{order_id}}", "#ORD-123")
    .replace("{{amount}}", "₹999")
    .replace("{{shop_name}}", "My Shop")
    .replace("{{link}}", "bizorapro.com/...");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Manually append controlled message state
    formData.set("message", message); 

    let res;
    if (initialData) {
      formData.append("id", initialData.id);
      res = await updateTemplateAction(formData);
    } else {
      res = await createTemplateAction(formData);
    }

    setLoading(false);
    if (res?.error) toast.error(res.error);
    else {
      toast.success(initialData ? "Template updated" : "Template saved");
      if (onClose) onClose();
      // Reset if creating new
      if (!initialData) setMessage(""); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input name="name" defaultValue={initialData?.name} placeholder="e.g. Welcome" required />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select name="category" defaultValue={initialData?.category || "general"}>
             <SelectTrigger><SelectValue /></SelectTrigger>
             <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="order">Order Update</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
             </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
         <div className="flex justify-between items-center">
            <Label>Message</Label>
            <div className="flex gap-1">
               {VARIABLES.map(v => (
                 <Badge 
                   key={v.value} 
                   variant="outline" 
                   className="cursor-pointer hover:bg-primary/10 text-[10px]"
                   onClick={() => insertVariable(v.value)}
                 >
                   {v.label}
                 </Badge>
               ))}
            </div>
         </div>
         <Textarea 
           value={message} 
           onChange={(e) => setMessage(e.target.value)} 
           placeholder="Type your message..." 
           rows={4} 
           required 
         />
      </div>

      {/* Smart Preview */}
      <div className="bg-secondary/20 p-3 rounded-lg text-sm text-muted-foreground">
         <p className="text-xs font-bold mb-1 uppercase tracking-wider">Preview:</p>
         <p className="italic">{previewText}</p>
      </div>

      <Button type="submit" className="w-full font-bold" disabled={loading}>
         {loading ? <Loader2 className="animate-spin mr-2" /> : (initialData ? "Update Template" : "Save Template")}
      </Button>
    </form>
  );
}