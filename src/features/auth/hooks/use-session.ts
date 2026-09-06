"use client";

import { useQuery } from "@tanstack/react-query";
import { getSession } from "../api";
import { authKeys } from "../query-keys";

export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: getSession,
    retry: false,
  });
}
