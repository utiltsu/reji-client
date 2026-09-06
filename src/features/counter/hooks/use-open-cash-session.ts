"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openCashSession } from "../api";
import { counterKeys } from "../query-keys";

export function useOpenCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openCashSession,
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: counterKeys.currentSession() });
    },
    onSuccess: (session) => {
      queryClient.setQueryData(counterKeys.currentSession(), session);
    },
  });
}
