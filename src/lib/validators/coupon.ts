import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be 3+ chars").toUpperCase().trim(),
  discountType: z.enum(["fixed", "percent"]),
  discountValue: z.coerce.number().min(1, "Value must be positive"),
  minOrderValue: z.coerce.number().default(0),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  maxUsesTotal: z.coerce.number().optional().nullable(),
  maxDiscountAmount: z.coerce.number().optional().nullable(),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
