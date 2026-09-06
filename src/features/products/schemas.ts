import { z } from "zod";

export const createProductInputSchema = z.object({
  imageUrl: z.string().url().nullable(),
  name: z.string().trim().min(1).max(200),
  price: z.number().int().min(0).max(2147483647),
});

export const updateProductInputSchema = createProductInputSchema.partial().extend({
  active: z.boolean().optional(),
});

export const productFormSchema = z.object({
  active: z.boolean(),
  imageUrl: z.string().trim().refine(
    (value) => value.length === 0 || z.string().url().safeParse(value).success,
    "Enter a valid image URL or leave this field empty.",
  ),
  name: z.string().trim().min(1, "Product name is required.").max(200, "Product name must be 200 characters or fewer."),
  price: z.string().trim().min(1, "Price is required.").regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimals."),
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;
