import { z } from "zod";

export const paymentMethodSchema = z.enum(["CASH", "PROMPTPAY"]);

export const openCashSessionInputSchema = z.object({
  openingFloat: z.number().int().min(0).max(2147483647),
});

export const openCashSessionFormSchema = z.object({
  openingFloat: z
    .string()
    .trim()
    .min(1, "Opening cash is required.")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimals."),
});

export const cashSessionSchema = z.object({
  id: z.string().uuid(),
  openedAt: z.string().datetime(),
  openingFloat: z.number().int().nonnegative(),
  openedBy: z.string(),
});

export const closeCashSessionInputSchema = z.object({
  closingCountedCash: z.number().int().min(0).max(2147483647),
});

export const closeCashSessionFormSchema = z.object({
  closingCountedCash: z
    .string()
    .trim()
    .min(1, "Counted cash is required.")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimals."),
});

export const cashSessionCloseResponseSchema = z.object({
  id: z.string().uuid(),
  openedAt: z.string().datetime(),
  closedAt: z.string().datetime(),
  openingFloat: z.number().int().nonnegative(),
  expectedCash: z.number().int().nonnegative(),
  closingCountedCash: z.number().int().nonnegative(),
  variance: z.number().int(),
  openedBy: z.string(),
  closedBy: z.string(),
});

export const saleLineItemInputSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
  discount: z.number().int().min(0).optional(),
});

export const createSaleInputSchema = z.union([
  z.object({
    paymentMethod: z.literal("CASH"),
    lineItems: z.array(saleLineItemInputSchema).min(1),
  }),
  z.object({
    checkoutToken: z.string().uuid(),
    paymentMethod: z.literal("PROMPTPAY"),
  }),
]);

export const preparePromptPayCheckoutInputSchema = z.object({
  lineItems: z.array(saleLineItemInputSchema).min(1),
  paymentMethod: z.literal("PROMPTPAY"),
});

export const saleLineItemSchema = z.object({
  productName: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative(),
});

export const saleSchema = z.object({
  id: z.string().uuid(),
  soldAt: z.string().datetime(),
  soldBy: z.string(),
  total: z.number().int().nonnegative(),
  paymentMethod: paymentMethodSchema,
  status: z.enum(["COMPLETED", "CANCELLED"]),
  receiptUrl: z.string(),
  promptpayQrPayload: z.string().optional(),
  stockWarning: z.boolean().optional(),
  lineItems: z.array(saleLineItemSchema),
  cancelledReason: z.string().optional(),
});

export const promptPayCheckoutPreparationLineSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative(),
});

export const promptPayCheckoutPreparationSchema = z.object({
  checkoutToken: z.string().uuid(),
  expiresAt: z.string().datetime(),
  total: z.number().int().nonnegative(),
  paymentMethod: z.literal("PROMPTPAY"),
  promptpayQrPayload: z.string().min(1),
  lineItems: z.array(promptPayCheckoutPreparationLineSchema).min(1),
});

export const receiptResponseSchema = z.object({
  status: z.enum(["COMPLETED", "CANCELLED"]),
  soldAt: z.string().datetime(),
  lineItems: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().int().min(1),
      unitPrice: z.number().int().nonnegative(),
      discount: z.number().int().nonnegative(),
    }),
  ),
  total: z.number().int().nonnegative(),
  paymentMethod: paymentMethodSchema,
});

export const checkoutFormSchema = z.object({
  paymentMethod: paymentMethodSchema,
});

export type CashSession = z.infer<typeof cashSessionSchema>;
export type CashSessionCloseResponse = z.infer<typeof cashSessionCloseResponseSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
export type CloseCashSessionFormValues = z.infer<typeof closeCashSessionFormSchema>;
export type CreateSaleInput = z.infer<typeof createSaleInputSchema>;
export type PreparePromptPayCheckoutInput = z.infer<typeof preparePromptPayCheckoutInputSchema>;
export type OpenCashSessionFormValues = z.infer<typeof openCashSessionFormSchema>;
export type PromptPayCheckoutPreparation = z.infer<typeof promptPayCheckoutPreparationSchema>;
export type Sale = z.infer<typeof saleSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type Receipt = z.infer<typeof receiptResponseSchema>;
