"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginByPin } from "../api";
import { authKeys } from "../query-keys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginByPin,
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session);
    },
  });
}
