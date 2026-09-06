"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { applyApiErrorToForm, getApiErrorMessage } from "@/lib/errors";
import { productFormSchema, type ProductFormValues } from "../schemas";

type ProductFormProps = {
  defaultValues: ProductFormValues;
  idPrefix: string;
  isEditing: boolean;
  isPending: boolean;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  resetAfterSubmit?: boolean;
};

export function ProductForm({ defaultValues, idPrefix, isEditing, isPending, onSubmit, resetAfterSubmit = false }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    defaultValues,
    resolver: zodResolver(productFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nameError = form.formState.errors.name;
  const priceError = form.formState.errors.price;
  const imageUrlError = form.formState.errors.imageUrl;

  async function handleSubmit(values: ProductFormValues) {
    setErrorMessage(null);

    try {
      await onSubmit(values);
      if (resetAfterSubmit) {
        form.reset(defaultValues);
      }
    } catch (error) {
      applyApiErrorToForm(error, form);
      setErrorMessage(getApiErrorMessage(error, "The product could not be saved."));
    }
  }

  return (
    <form className="space-y-5" onSubmit={(event) => void form.handleSubmit(handleSubmit)(event)}>
      <Field data-invalid={Boolean(nameError)}>
        <FieldLabel htmlFor={`${idPrefix}-product-name`}>Product name</FieldLabel>
        <Input aria-invalid={Boolean(nameError)} id={`${idPrefix}-product-name`} placeholder="Chocolate Chip Cookie" {...form.register("name")} />
        <FieldError errors={nameError ? [nameError] : undefined} />
      </Field>
      <Field data-invalid={Boolean(priceError)}>
        <FieldLabel htmlFor={`${idPrefix}-product-price`}>Price</FieldLabel>
        <Input aria-invalid={Boolean(priceError)} id={`${idPrefix}-product-price`} inputMode="decimal" min="0" placeholder="35.00" step="0.01" type="number" {...form.register("price")} />
        <FieldDescription>Enter the selling price in Thai baht.</FieldDescription>
        <FieldError errors={priceError ? [priceError] : undefined} />
      </Field>
      <Field data-invalid={Boolean(imageUrlError)}>
        <FieldLabel htmlFor={`${idPrefix}-product-image-url`}>Image URL</FieldLabel>
        <Input aria-invalid={Boolean(imageUrlError)} id={`${idPrefix}-product-image-url`} placeholder="https://…" type="url" {...form.register("imageUrl")} />
        <FieldDescription>Optional. Use a public product image URL.</FieldDescription>
        <FieldError errors={imageUrlError ? [imageUrlError] : undefined} />
      </Field>
      {isEditing ? (
        <Controller
          control={form.control}
          name="active"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <Checkbox aria-invalid={fieldState.invalid} checked={field.value} id={`${idPrefix}-product-active`} onCheckedChange={field.onChange} />
              <div className="space-y-1">
                <FieldLabel htmlFor={`${idPrefix}-product-active`}>Active product</FieldLabel>
                <FieldDescription>Inactive products are hidden from the Counter.</FieldDescription>
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </div>
            </Field>
          )}
        />
      ) : null}
      {errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "Saving…" : isEditing ? "Save changes" : "Add product"}
      </Button>
    </form>
  );
}
