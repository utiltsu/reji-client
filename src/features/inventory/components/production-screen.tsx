"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useProducts } from "@/hooks/use-products";
import { getApiErrorMessage } from "@/lib/errors";
import { LeftoverForm } from "./leftover-form";
import { ProductionBatchForm } from "./production-batch-form";

export function ProductionScreen() {
  const products = useProducts();

  if (products.isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[34rem]" />
          <Skeleton className="h-[34rem]" />
        </div>
      </div>
    );
  }

  if (products.isError) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6" role="alert">
          <h1 className="text-xl font-semibold text-destructive">Products could not be loaded.</h1>
          <p className="mt-2 text-sm text-muted-foreground">{getApiErrorMessage(products.error, "Please try again.")}</p>
          <Button className="mt-5" onClick={() => void products.refetch()} variant="outline">
            <RefreshCw />
            Try again
          </Button>
        </section>
      </div>
    );
  }

  if (!products.data || products.data.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <EmptyState description="Add an active product before recording production or leftovers." title="No products available" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
      <header>
        <p className="text-sm font-medium text-primary">Inventory</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Production & leftovers</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Record baked stock and end-of-day leftovers. These records are immutable after submission.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Record production</h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">Add the quantity baked for a product and business date.</p>
          <ProductionBatchForm products={products.data} />
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Record leftovers</h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">Record unsold stock before closing the cash session.</p>
          <LeftoverForm products={products.data} />
        </section>
      </div>
    </div>
  );
}
