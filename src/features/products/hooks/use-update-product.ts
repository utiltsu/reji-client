"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "@/hooks/use-products";
import { updateProduct } from "../api";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof updateProduct>[1] }) => updateProduct(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}
