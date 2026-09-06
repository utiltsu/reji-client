"use client";

import { useMutation } from "@tanstack/react-query";
import { recordProductionBatch } from "../api";

export function useRecordProductionBatch() {
  return useMutation({ mutationFn: recordProductionBatch });
}
