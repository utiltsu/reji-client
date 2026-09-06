import { apiClient } from "@/lib/api-client";
import { productSchema, type Product } from "@/hooks/use-products";
import {
  createProductInputSchema,
  updateProductInputSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "./schemas";

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const payload = createProductInputSchema.parse(input);
  const response: unknown = await apiClient<unknown>("/api/bff/products", {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return productSchema.parse(response);
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const payload = updateProductInputSchema.parse(input);
  const response: unknown = await apiClient<unknown>(`/api/bff/products/${id}`, {
    body: JSON.stringify(payload),
    method: "PATCH",
  });
  return productSchema.parse(response);
}
