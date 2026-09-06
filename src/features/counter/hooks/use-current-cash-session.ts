"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentCashSession } from "../api";
import { counterKeys } from "../query-keys";

export function useCurrentCashSession() {
  return useQuery({
    queryKey: counterKeys.currentSession(),
    queryFn: getCurrentCashSession,
  });
}
