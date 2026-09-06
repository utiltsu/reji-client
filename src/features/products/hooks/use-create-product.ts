"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "@/hooks/use-products";
import { createProduct } from "../api";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}
