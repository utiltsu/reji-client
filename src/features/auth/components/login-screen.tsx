"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/errors";
import { useLogin } from "../hooks/use-login";

export function LoginScreen() {
  const router = useRouter();
  const login = useLogin();
  const [pin, setPin] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login.mutate(pin, {
      onSuccess: () => router.push("/counter"),
    });
  }

  const errorMessage = getLoginErrorMessage(login.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-6 py-12">
      <section className="w-full max-w-sm rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Reji</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your 4-digit PIN to start using the counter.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <Input
              aria-describedby={errorMessage ? "login-error" : undefined}
              aria-invalid={Boolean(errorMessage)}
              autoComplete="one-time-code"
              className="h-12 text-center text-2xl tracking-[0.5em]"
              id="pin"
              inputMode="numeric"
              maxLength={4}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
              pattern="[0-9]{4}"
              type="password"
              value={pin}
            />
          </div>

          {errorMessage ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" id="login-error">
              {errorMessage}
            </p>
          ) : null}

          <Button className="w-full" disabled={pin.length !== 4 || login.isPending} type="submit">
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}

function getLoginErrorMessage(error: Error | null): string | null {
  if (!(error instanceof ApiError)) {
    return error ? "Sign-in failed. Please try again." : null;
  }

  if (error.status === 423 || error.code === "LOCKED") {
    return "This PIN is temporarily locked. Please wait and try again.";
  }

  if (error.status === 401) {
    return "Incorrect PIN.";
  }

  return "Sign-in failed. Please try again.";
}
