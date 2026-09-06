"use client";

import {
  BarChart3,
  CalendarDays,
  ChefHat,
  LogOut,
  Package,
  ShoppingCart,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
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

        <SidebarSeparator />

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

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">{name}</p>
                  <p className="text-xs text-sidebar-foreground/70">{role === "OWNER" ? "Owner" : "Cashier"}</p>
                </div>
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <form action="/api/auth/logout" method="post">
                <SidebarMenuButton tooltip="Sign out" type="submit">
                  <LogOut />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger />
          <div className="h-5 w-px bg-border" />
          <p className="text-sm font-medium text-muted-foreground">
            {role === "OWNER" ? "Owner workspace" : "Cashier workspace"}
          </p>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
