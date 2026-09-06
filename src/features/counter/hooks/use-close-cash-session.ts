"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeCashSession } from "../api";
import { counterKeys } from "../query-keys";

export function useCloseCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, closingCountedCash }: { sessionId: string; closingCountedCash: number }) =>
      closeCashSession(sessionId, { closingCountedCash }),
    onSuccess: () => {
      queryClient.setQueryData(counterKeys.currentSession(), null);
    },
  });
}
