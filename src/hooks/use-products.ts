"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";

const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  imageUrl: z.string().url().nullable(),
  active: z.boolean(),
});

const productListResponseSchema = z.object({
  data: z.array(productSchema),
  meta: z.object({
    limit: z.number().int(),
    page: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
};

export type Product = z.infer<typeof productSchema>;

async function getProducts(): Promise<Product[]> {
  const response: unknown = await apiClient<unknown>("/api/bff/products?page=1&limit=100");
  return productListResponseSchema.parse(response).data;
}

export function useProducts() {
  return useQuery({
    queryFn: getProducts,
    queryKey: productKeys.list(),
  });
}
