"use client";

import { useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";
import { getApiErrorMessage } from "@/lib/errors";
import { CloseSessionForm } from "./close-session-form";
import { CheckoutPanel } from "./checkout-panel";
import { OpenSessionForm } from "./open-session-form";
import { ProductGrid } from "./product-grid";
import { useCart } from "../hooks/use-cart";
import { useCloseCashSession } from "../hooks/use-close-cash-session";
import { useCurrentCashSession } from "../hooks/use-current-cash-session";
import { useOpenCashSession } from "../hooks/use-open-cash-session";
import { bahtToSatang, formatCurrency, formatDateTime } from "@/lib/format";
import type { CloseCashSessionFormValues, OpenCashSessionFormValues } from "../schemas";

export function CounterScreen() {
  const cart = useCart();
  const products = useProducts();
  const currentSession = useCurrentCashSession();
  const openSession = useOpenCashSession();
  const closeSession = useCloseCashSession();
  const session = currentSession.data;

  const cartItems = useMemo(
    () =>
      cart.items.flatMap((item) => {
        const product = products.data?.find((currentProduct) => currentProduct.id === item.productId);
        return product ? [{ ...item, product }] : [];
      }),
    [cart.items, products.data],
  );
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  async function handleOpenSession(values: OpenCashSessionFormValues) {
    await openSession.mutateAsync({ openingFloat: bahtToSatang(values.openingFloat) });
    toast.success("Cash session opened");
  }

  async function handleCloseSession(values: CloseCashSessionFormValues) {
    if (!session) {
      return;
    }

    await closeSession.mutateAsync({
      closingCountedCash: bahtToSatang(values.closingCountedCash),
      sessionId: session.id,
    });
    cart.clear();
    toast.success("Cash session closed");
  }

  function handleStartAnotherSession() {
    closeSession.reset();
    openSession.reset();
    cart.clear();
  }

  if (currentSession.isLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-5 px-6 py-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (currentSession.isError) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6" role="alert">
          <p className="font-medium text-destructive">Cash session status could not be loaded.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {getApiErrorMessage(currentSession.error, "Please try again.")}
          </p>
          <Button className="mt-4" onClick={() => void currentSession.refetch()} size="sm" variant="outline">
            <RefreshCw />
            Try again
          </Button>
        </section>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-primary">Counter</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Open a cash session</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Start the drawer before adding products or checking out a sale.
          </p>
          <div className="mt-8">
            <OpenSessionForm isPending={openSession.isPending} onSubmit={handleOpenSession} />
          </div>
        </section>
      </div>
    );
  }

  if (closeSession.data) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-primary">Day end</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Session closed</h1>
          <p className="mt-3 text-muted-foreground">The cash count has been recorded.</p>
          <dl className="mt-8 divide-y rounded-xl border">
            <SummaryRow label="Opening cash" value={formatCurrency(closeSession.data.openingFloat)} />
            <SummaryRow label="Expected cash" value={formatCurrency(closeSession.data.expectedCash)} />
            <SummaryRow label="Counted cash" value={formatCurrency(closeSession.data.closingCountedCash)} />
            <SummaryRow label="Variance" value={formatCurrency(closeSession.data.variance)} />
            <SummaryRow label="Closed at" value={formatDateTime(closeSession.data.closedAt)} />
          </dl>
          <Button className="mt-8" onClick={handleStartAnotherSession}>Open another session</Button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8">
      <header className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Counter</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Sell at the counter</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Session opened {formatDateTime(session.openedAt)} by {session.openedBy}.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          Open · {formatCurrency(session.openingFloat)} float
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Products</h2>
          <ProductGrid
            error={products.error}
            isLoading={products.isLoading}
            onAddProduct={cart.addProduct}
            onRetry={products.refetch}
            products={products.data ?? []}
          />
        </section>
        <aside className="h-fit rounded-2xl border bg-card p-5 shadow-sm">
          <CheckoutPanel
            items={cartItems}
            onAddProduct={cart.addProduct}
            onClear={cart.clear}
            onDecreaseProduct={cart.decreaseProduct}
            onRemoveProduct={cart.removeProduct}
            total={total}
          />
        </aside>
      </div>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Close session</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">
          Closing reconciles counted cash against completed cash sales. Leftovers must be reconciled first.
        </p>
        <CloseSessionForm isPending={closeSession.isPending} onSubmit={handleCloseSession} />
      </section>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
