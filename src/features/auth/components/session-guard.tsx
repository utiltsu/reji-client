"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "../hooks/use-session";
import type { AuthenticatedSession, Session } from "../schemas";

type SessionGuardProps = {
  children: ReactNode;
  requiredRole?: AuthenticatedSession["role"];
};

export function SessionGuard({ children, requiredRole }: SessionGuardProps) {
  const session = useSession();
  const sessionData = session.data;

  if (session.isLoading) {
    return <Skeleton className="min-h-screen rounded-none" />;
  }

  if (session.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-800">Unable to verify your session.</p>
          <Button className="mt-4" onClick={() => void session.refetch()} variant="outline">
            Try again
          </Button>
        </div>
      </main>
    );
  }

  if (!isAuthenticatedSession(sessionData)) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-slate-700">Please sign in to continue.</p>
          <Link className="mt-4 inline-block text-sm font-medium text-amber-700 underline" href="/">
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  const authenticatedSession = sessionData;

  if (requiredRole && authenticatedSession.role !== requiredRole) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="font-medium text-slate-900">Owner access required.</p>
          <p className="mt-2 text-sm text-slate-600">You do not have permission to manage products.</p>
          <Link className="mt-4 inline-block text-sm font-medium text-amber-700 underline" href="/counter">
            Return to counter
          </Link>
        </div>
      </main>
    );
  }

  return (
    <AppShell name={authenticatedSession.name} role={authenticatedSession.role}>
      {children}
    </AppShell>
  );
}

function isAuthenticatedSession(
  value: Session | undefined,
): value is AuthenticatedSession {
  return Boolean(value?.authenticated && value.role && value.name);
}
