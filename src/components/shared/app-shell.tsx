"use client";

import {
  BarChart3,
  CalendarDays,
  ChefHat,
  ChevronDown,
  LogOut,
  Package,
  ShoppingCart,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { RejiRole } from "@/features/auth/schemas";
import { AppLogo } from "./app-logo";

type AppShellProps = {
  children: ReactNode;
  name: string;
  role: RejiRole;
};

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  roles: readonly RejiRole[];
};

const navItems: readonly NavItem[] = [
  { href: "/counter", icon: ShoppingCart, label: "Counter", roles: ["OWNER", "CASHIER"] },
  { href: "/day-end", icon: CalendarDays, label: "Day end", roles: ["OWNER", "CASHIER"] },
  { href: "/catalog", icon: Package, label: "Products", roles: ["OWNER", "CASHIER"] },
  { href: "/production", icon: ChefHat, label: "Production", roles: ["OWNER", "CASHIER"] },
  { href: "/expenses", icon: WalletCards, label: "Expenses", roles: ["OWNER"] },
  { href: "/reports", icon: BarChart3, label: "Reports", roles: ["OWNER"] },
];

export function AppShell({ children, name, role }: AppShellProps) {
  const pathname = usePathname();
  const visibleNavItems = navItems.filter((item) => item.roles.includes(role));
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link aria-label="Home" href="/counter" />}
                size="lg"
              >
                <AppLogo />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <div aria-hidden="true" className="mx-2 h-px bg-sidebar-border" />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleNavItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={<Link href={item.href} />}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="h-5 w-px bg-border" />
            <p className="text-sm font-medium text-muted-foreground">
              {role === "OWNER" ? "Owner workspace" : "Cashier workspace"}
            </p>
          </div>
          <UserMenu initial={initial} name={name} role={role} />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

type UserMenuProps = {
  initial: string;
  name: string;
  role: RejiRole;
};

function UserMenu({ initial, name, role }: UserMenuProps) {
  const roleLabel = role === "OWNER" ? "Owner" : "Cashier";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={`Open account menu for ${name}`}
            className="h-10 gap-3 rounded-xl px-2"
            variant="ghost"
          />
        }
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {initial}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-32 truncate text-sm font-medium">{name}</span>
          <span className="block text-xs text-muted-foreground">{roleLabel}</span>
        </span>
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block truncate text-sm font-medium text-foreground">{name}</span>
            <span className="block text-xs font-normal">{roleLabel}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <form action="/api/auth/logout" method="post">
            <DropdownMenuItem className="w-full" nativeButton render={<button type="submit" />}>
              <LogOut />
              <span>Sign out</span>
            </DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
