"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
          <Select onValueChange={(value) => field.onChange(value ?? "")} value={field.value as string}>
            <SelectTrigger aria-invalid={fieldState.invalid} id={`${String(name)}-product`}>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
        </Field>
      )}
    />
  );
}
