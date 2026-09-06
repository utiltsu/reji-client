"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api";
import { counterKeys } from "../query-keys";

export function useProducts() {
  return useQuery({
    queryFn: getProducts,
    queryKey: counterKeys.products(),
  });
}
