"use client";

import { useMutation } from "@tanstack/react-query";
import { openCashSession } from "../api";

export function useOpenCashSession() {
  return useMutation({ mutationFn: openCashSession });
}
