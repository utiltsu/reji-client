import { z } from "zod";

const businessDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid business date.");

export const leftoverCauseSchema = z.enum(["DISCARDED", "TAKEN_HOME", "GIVEN_AWAY"]);

export const recordProductionBatchInputSchema = z.object({
  productId: z.string().uuid(),
  businessDate: businessDateSchema,
  quantity: z.number().int().min(1).max(2147483647),
  costPerUnit: z.number().int().min(0).max(2147483647),
});

export const productionBatchFormSchema = z.object({
  productId: z.string().min(1, "Select a product."),
  businessDate: businessDateSchema,
  quantity: z.string().regex(/^\d+$/, "Enter a whole number greater than zero.").refine((value) => Number(value) > 0, "Enter a whole number greater than zero."),
  costPerUnit: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimals."),
});

export const productionBatchResponseSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  businessDate: businessDateSchema,
  quantity: z.number().int().positive(),
  costPerUnit: z.number().int().nonnegative(),
  recordedBy: z.string(),
});

export const recordLeftoverInputSchema = z.object({
  productId: z.string().uuid(),
  businessDate: businessDateSchema,
  quantity: z.number().int().min(1).max(2147483647),
  cause: leftoverCauseSchema,
  note: z.string().nullable().optional(),
});

export const leftoverFormSchema = z.object({
  productId: z.string().min(1, "Select a product."),
  businessDate: businessDateSchema,
  quantity: z.string().regex(/^\d+$/, "Enter a whole number greater than zero.").refine((value) => Number(value) > 0, "Enter a whole number greater than zero."),
  cause: leftoverCauseSchema,
  note: z.string(),
});

export const leftoverResponseSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  businessDate: businessDateSchema,
  quantity: z.number().int().positive(),
  cause: leftoverCauseSchema,
  note: z.string().nullable(),
});

export type LeftoverCause = z.infer<typeof leftoverCauseSchema>;
export type LeftoverFormValues = z.infer<typeof leftoverFormSchema>;
export type ProductionBatchFormValues = z.infer<typeof productionBatchFormSchema>;
export type RecordLeftoverInput = z.infer<typeof recordLeftoverInputSchema>;
export type RecordProductionBatchInput = z.infer<typeof recordProductionBatchInputSchema>;
