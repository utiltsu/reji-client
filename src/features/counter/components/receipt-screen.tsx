"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { getApiErrorMessage } from "@/lib/errors";
import { clientEnv } from "@/lib/env";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useReceipt } from "../hooks/use-receipt";

type ReceiptScreenProps = {
  token: string;
};

export function ReceiptScreen({ token }: ReceiptScreenProps) {
  const receipt = useReceipt(token);

  if (receipt.isLoading) {
    return (
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-3 h-5 w-64" />
        <Skeleton className="mt-8 h-48 w-full" />
      </main>
    );
  }

  if (receipt.isError) {
    return (
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6" role="alert">
          <h1 className="text-xl font-semibold text-destructive">Receipt unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {getApiErrorMessage(receipt.error, "This receipt could not be loaded.")}
          </p>
          <Button className="mt-5" onClick={() => void receipt.refetch()} variant="outline">
            <RefreshCw />
            Try again
          </Button>
        </section>
      </main>
    );
  }

  if (!receipt.data) {
    return (
      <main className="mx-auto w-full max-w-lg px-6 py-10">
        <EmptyState description="The receipt does not contain any sale details." title="Receipt is empty" />
      </main>
    );
  }

  const { data } = receipt;
  const isCancelled = data.status === "CANCELLED";

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-10">
      <section className="mx-auto w-full max-w-lg rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">{clientEnv.NEXT_PUBLIC_APP_NAME} receipt</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {isCancelled ? "Cancelled sale" : "Thank you"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{formatDateTime(data.soldAt)}</p>
        </div>

        <div className="mt-8 divide-y border-y">
          {data.lineItems.map((item, index) => (
            <div className="flex items-center justify-between gap-4 py-3 text-sm" key={`${item.name}-${index}`}>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{item.name}</p>
                <p className="text-muted-foreground">
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <span className="shrink-0 font-medium text-foreground">
                {formatCurrency(item.unitPrice * item.quantity - item.discount)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(data.total)}</span>
        </div>
        <p className="mt-2 text-right text-sm text-muted-foreground">
          Paid by {data.paymentMethod === "PROMPTPAY" ? "PromptPay" : "cash"}
        </p>
      </section>
    </main>
  );
}
