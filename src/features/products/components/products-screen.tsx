"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductImage } from "@/components/shared/product-image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, type Product } from "@/hooks/use-products";
import { bahtToSatang, formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/errors";
import { useCreateProduct } from "../hooks/use-create-product";
import { useUpdateProduct } from "../hooks/use-update-product";
import { type ProductFormValues } from "../schemas";
import { ProductForm } from "./product-form";

const EMPTY_PRODUCT_FORM_VALUES: ProductFormValues = {
  active: true,
  imageUrl: "",
  name: "",
  price: "",
};

export function ProductsScreen() {
  const products = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const selectedProduct = useMemo(
    () => products.data?.find((product) => product.id === selectedProductId),
    [products.data, selectedProductId],
  );

  async function handleCreate(values: ProductFormValues) {
    await createProduct.mutateAsync({
      imageUrl: values.imageUrl.trim() || null,
      name: values.name.trim(),
      price: bahtToSatang(values.price),
    });
    toast.success("Product added");
  }

  async function handleUpdate(values: ProductFormValues) {
    if (!selectedProduct) {
      return;
    }

    await updateProduct.mutateAsync({
      id: selectedProduct.id,
      input: {
        active: values.active,
        imageUrl: values.imageUrl.trim() || null,
        name: values.name.trim(),
        price: bahtToSatang(values.price),
      },
    });
    toast.success("Product updated");
    if (!values.active) {
      setSelectedProductId(null);
    }
  }

  if (products.isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <Skeleton className="h-[32rem]" />
          <Skeleton className="h-[32rem]" />
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
          <Button className="mt-5" onClick={() => void products.refetch()} variant="outline">Try again</Button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
      <header>
        <p className="text-sm font-medium text-primary">Catalog</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Products</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Add products and keep active prices up to date for the Counter.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Active products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Only active products appear in the Counter.</p>
          </div>
          {!products.data || products.data.length === 0 ? (
            <EmptyState description="Add your first product using the form." title="No active products" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {products.data.map((product) => (
                <ProductListItem
                  isSelected={product.id === selectedProductId}
                  key={product.id}
                  onSelect={() => setSelectedProductId(product.id)}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Add product</h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">Create a new sellable product.</p>
          <ProductForm
            defaultValues={EMPTY_PRODUCT_FORM_VALUES}
            idPrefix="create"
            isEditing={false}
            isPending={createProduct.isPending}
            onSubmit={handleCreate}
            resetAfterSubmit
          />
        </section>
      </div>

      {selectedProduct ? (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Edit product</h2>
            <p className="mt-1 text-sm text-muted-foreground">Update the product details or deactivate it from the Counter.</p>
          </div>
          <div className="max-w-xl">
            <ProductForm
              defaultValues={getProductFormValues(selectedProduct)}
              idPrefix="edit"
              isEditing
              isPending={updateProduct.isPending}
              key={selectedProduct.id}
              onSubmit={handleUpdate}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}

type ProductListItemProps = {
  isSelected: boolean;
  onSelect: () => void;
  product: Product;
};

function ProductListItem({ isSelected, onSelect, product }: ProductListItemProps) {
  return (
    <Button className="h-auto min-h-28 items-center gap-3 whitespace-normal p-3 text-left" onClick={onSelect} variant={isSelected ? "default" : "outline"}>
      <ProductImage alt={product.name} className="size-14" src={product.imageUrl} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold">{product.name}</span>
        <span className="mt-1 block text-sm opacity-80">{formatCurrency(product.price)}</span>
      </span>
    </Button>
  );
}

function getProductFormValues(product: Product): ProductFormValues {
  return {
    active: product.active,
    imageUrl: product.imageUrl ?? "",
    name: product.name,
    price: (product.price / 100).toFixed(2),
  };
}
