"use client";

import { useQuery } from "@tanstack/react-query";
import { getReceipt } from "../api";
import { counterKeys } from "../query-keys";

export function useReceipt(token: string) {
  return useQuery({
    enabled: token.length > 0,
    queryFn: () => getReceipt(token),
    queryKey: counterKeys.receipt(token),
    retry: false,
  });
}
