"use client";

import { useMutation } from "@tanstack/react-query";
import { closeCashSession } from "../api";

export function useCloseCashSession() {
  return useMutation({ mutationFn: ({ sessionId, closingCountedCash }: { sessionId: string; closingCountedCash: number }) => closeCashSession(sessionId, { closingCountedCash }) });
}
