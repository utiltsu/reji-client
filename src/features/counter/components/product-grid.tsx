"use client";

import { useMemo, useState } from "react";
import { Package, RefreshCw, Search, X } from "lucide-react";
import { ProductImage } from "@/components/shared/product-image";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { getApiErrorMessage } from "@/lib/errors";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/hooks/use-products";

type ProductGridProps = {
  error: unknown;
  isDisabled?: boolean;
  isLoading: boolean;
  onAddProduct: (productId: string) => void;
  onRetry: () => Promise<unknown>;
  products: Product[];
};

export function ProductGrid({ error, isDisabled = false, isLoading, onAddProduct, onRetry, products }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
  const filteredProducts = useMemo(
    () =>
      normalizedSearchTerm
        ? products.filter((product) => product.name.toLocaleLowerCase().includes(normalizedSearchTerm))
        : products,
    [normalizedSearchTerm, products],
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-36" key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6" role="alert">
        <p className="font-medium text-destructive">Products could not be loaded.</p>
        <p className="mt-1 text-sm text-muted-foreground">{getApiErrorMessage(error, "Please try again.")}</p>
        <Button className="mt-4" onClick={() => void onRetry()} size="sm" variant="outline">
          <RefreshCw />
          Try again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState description="Add an active product before starting sales." title="No products available" />;
  }

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel className="sr-only" htmlFor="counter-product-search">
          Search products
        </FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="counter-product-search"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products by name"
            type="search"
            value={searchTerm}
          />
          {searchTerm ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton aria-label="Clear product search" onClick={() => setSearchTerm("")} size="icon-xs">
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </Field>

      {filteredProducts.length === 0 ? (
        <EmptyState description="Try a different product name." title="No matching products" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Button
              className="h-auto min-h-48 flex-col items-start justify-between gap-4 whitespace-normal p-5 text-left"
              disabled={isDisabled}
              key={product.id}
              onClick={() => onAddProduct(product.id)}
              variant="outline"
            >
              <span className="flex w-full items-center justify-between gap-3">
                {product.imageUrl ? (
                  <ProductImage alt={product.name} className="size-14" src={product.imageUrl} />
                ) : (
                  <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Package />
                  </span>
                )}
                <span className="text-base font-semibold text-foreground">{formatCurrency(product.price)}</span>
              </span>
              <span className="w-full text-base font-medium text-foreground">{product.name}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
