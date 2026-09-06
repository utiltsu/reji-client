"use client";

import { ChevronUp, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetClose,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/format";
import { CheckoutPanel, type CheckoutPanelProps } from "./checkout-panel";

type MobileCartSheetProps = CheckoutPanelProps & {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function MobileCartSheet({ isOpen, onOpenChange, ...checkoutPanelProps }: MobileCartSheetProps) {
  const itemCount = checkoutPanelProps.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet onOpenChange={onOpenChange} open={isOpen}>
      <SheetTrigger
        render={
          <Button className="h-14 w-full justify-between rounded-none border-0 bg-card px-5 text-left text-foreground shadow-[0_-8px_24px_-16px_var(--foreground)] hover:bg-card" />
        }
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingCart />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {checkoutPanelProps.isCartLocked ? "Continue PromptPay" : itemCount > 0 ? "Current cart" : "Cart is empty"}
            </span>
            <span className="block text-xs font-normal text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"} · {formatCurrency(checkoutPanelProps.total)}
            </span>
          </span>
        </span>
        <span className="flex items-center gap-2 text-sm font-medium text-primary">
          View cart
          <ChevronUp />
        </span>
      </SheetTrigger>
      <SheetContent className="max-h-[90dvh] rounded-t-3xl px-0 pb-0" showCloseButton={false} side="bottom">
        <SheetHeader className="sr-only">
          <SheetTitle>Current cart</SheetTitle>
          <SheetDescription>Review the current sale and complete checkout.</SheetDescription>
        </SheetHeader>
        <div className="flex justify-end px-5 pt-2">
          <SheetClose
            render={
              <Button aria-label="Close cart" size="icon-sm" variant="ghost" />
            }
          >
            <X />
          </SheetClose>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-2">
          <CheckoutPanel {...checkoutPanelProps} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
