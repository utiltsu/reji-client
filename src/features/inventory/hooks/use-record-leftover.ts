"use client";

import { useMutation } from "@tanstack/react-query";
import { recordLeftover } from "../api";

export function useRecordLeftover() {
  return useMutation({ mutationFn: recordLeftover });
}
