import { apiClient } from "../../lib/api-client";
import {
  cashSessionCloseResponseSchema,
  cashSessionSchema,
  closeCashSessionInputSchema,
  createSaleInputSchema,
  openCashSessionInputSchema,
  productListResponseSchema,
  receiptResponseSchema,
  saleSchema,
  type CashSession,
  type CashSessionCloseResponse,
  type CreateSaleInput,
  type Product,
  type Receipt,
  type Sale,
} from "./schemas";

export async function getProducts(): Promise<Product[]> {
  const response: unknown = await apiClient<unknown>("/api/bff/products?page=1&limit=100");
  return productListResponseSchema.parse(response).data;
}

export async function openCashSession(input: { openingFloat: number }): Promise<CashSession> {
  const payload = openCashSessionInputSchema.parse(input);
  const response: unknown = await apiClient<unknown>("/api/bff/sessions", {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return cashSessionSchema.parse(response);
}

export async function closeCashSession(
  sessionId: string,
  input: { closingCountedCash: number },
): Promise<CashSessionCloseResponse> {
  const payload = closeCashSessionInputSchema.parse(input);
  const response: unknown = await apiClient<unknown>(`/api/bff/sessions/${sessionId}/close`, {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return cashSessionCloseResponseSchema.parse(response);
}

export async function createSale(input: CreateSaleInput): Promise<Sale> {
  const payload = createSaleInputSchema.parse(input);
  const response: unknown = await apiClient<unknown>("/api/bff/sales", {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return saleSchema.parse(response);
}

export async function getReceipt(token: string): Promise<Receipt> {
  const response: unknown = await apiClient<unknown>(`/api/bff/r/${encodeURIComponent(token)}`);
  return receiptResponseSchema.parse(response);
}
