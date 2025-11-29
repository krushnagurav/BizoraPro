import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  imageUrl: z.string().optional().or(z.literal("")).nullable(),
  status: z.enum(["active", "hidden"]).default("active"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
