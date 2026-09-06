"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { Product } from "@/hooks/use-products";

type ProductSelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  products: Product[];
};

export function ProductSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  products,
}: ProductSelectFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`${String(name)}-product`}>Product</FieldLabel>
          <Combobox
            itemToStringValue={(product) => product.name}
            items={products}
            onValueChange={(product) => field.onChange(product?.id ?? "")}
            value={products.find((product) => product.id === field.value) ?? null}
          >
            <ComboboxInput
              aria-invalid={fieldState.invalid}
              id={`${String(name)}-product`}
              placeholder="Search products"
              showClear
            />
            <ComboboxContent>
              <ComboboxEmpty>No products found.</ComboboxEmpty>
              <ComboboxList>
                {(product) => (
                  <ComboboxItem key={product.id} value={product}>
                    {product.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
        </Field>
      )}
    />
  );
}
