import { z } from "zod";

// The Master Schema
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  salePrice: z.coerce.number().optional().nullable(),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")).nullable(),
  
  // JSON Strings (parsed on server)
  variants: z.string().optional(), 
  galleryImages: z.string().optional(), 
  badges: z.string().optional(),
});

// Derived Schemas
export const createProductSchema = productSchema;
export const updateProductSchema = productSchema.extend({
  id: z.string().uuid(),
});
export const productIdSchema = z.object({
  id: z.string().uuid(),
});