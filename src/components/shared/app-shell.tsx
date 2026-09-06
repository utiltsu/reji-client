import Link from "next/link";
import type { ReactNode } from "react";
import type { RejiRole } from "@/features/auth/schemas";

type AppShellProps = {
  children: ReactNode;
  name: string;
  role: RejiRole;
};

export function AppShell({ children, name, role }: AppShellProps) {
  const isOwner = role === "OWNER";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link className="text-xl font-semibold tracking-tight text-slate-900" href="/counter">
            Reji
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>{name}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {isOwner ? "Owner" : "Cashier"}
            </span>
            <form action="/api/auth/logout" method="post">
              <button className="font-medium text-slate-700 underline-offset-4 hover:underline" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 pb-3">
          <NavLink href="/counter">Counter</NavLink>
          <NavLink href="/day-end">Day end</NavLink>
          {isOwner ? (
            <>
              <NavLink href="/catalog">Products</NavLink>
              <NavLink href="/production">Production</NavLink>
              <NavLink href="/expenses">Expenses</NavLink>
              <NavLink href="/reports">Reports</NavLink>
            </>
          ) : null}
        </nav>
      </header>
      {children}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900" href={href}>
      {children}
    </Link>
  );
}
