"use client";

import { useMutation } from "@tanstack/react-query";
import { preparePromptPayCheckout } from "../api";

export function usePreparePromptPayCheckout() {
  return useMutation({ mutationFn: preparePromptPayCheckout });
}
