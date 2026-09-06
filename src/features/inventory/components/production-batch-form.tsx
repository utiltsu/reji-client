"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { applyApiErrorToForm, getApiErrorMessage } from "@/lib/errors";
import { bahtToSatang } from "@/lib/format";
import { useRecordProductionBatch } from "../hooks/use-record-production-batch";
import { productionBatchFormSchema, type ProductionBatchFormValues } from "../schemas";
import { ProductSelectField } from "./product-select-field";
import type { Product } from "@/hooks/use-products";

type ProductionBatchFormProps = {
  products: Product[];
};

export function ProductionBatchForm({ products }: ProductionBatchFormProps) {
  const recordBatch = useRecordProductionBatch();
  const form = useForm<ProductionBatchFormValues>({
    defaultValues: { businessDate: "", costPerUnit: "", productId: "", quantity: "" },
    resolver: zodResolver(productionBatchFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: ProductionBatchFormValues) {
    setErrorMessage(null);

    try {
      await recordBatch.mutateAsync({
        businessDate: values.businessDate,
        costPerUnit: bahtToSatang(values.costPerUnit),
        productId: values.productId,
        quantity: Number(values.quantity),
      });
      form.reset({ businessDate: values.businessDate, costPerUnit: "", productId: "", quantity: "" });
      toast.success("Production batch recorded");
    } catch (error) {
      applyApiErrorToForm(error, form);
      setErrorMessage(getApiErrorMessage(error, "The production batch could not be recorded."));
    }
  }

  const businessDateError = form.formState.errors.businessDate;
  const quantityError = form.formState.errors.quantity;
  const costPerUnitError = form.formState.errors.costPerUnit;

  return (
    <form className="space-y-5" onSubmit={(event) => void form.handleSubmit(handleSubmit)(event)}>
      <ProductSelectField control={form.control} name="productId" products={products} />
      <Field data-invalid={Boolean(businessDateError)}>
        <FieldLabel htmlFor="production-business-date">Business date</FieldLabel>
        <Input aria-invalid={Boolean(businessDateError)} id="production-business-date" type="date" {...form.register("businessDate")} />
        <FieldDescription>Use the shop&apos;s Bangkok business date.</FieldDescription>
        <FieldError errors={businessDateError ? [businessDateError] : undefined} />
      </Field>
      <Field data-invalid={Boolean(quantityError)}>
        <FieldLabel htmlFor="production-quantity">Quantity produced</FieldLabel>
        <Input aria-invalid={Boolean(quantityError)} id="production-quantity" inputMode="numeric" min="1" step="1" type="number" {...form.register("quantity")} />
        <FieldError errors={quantityError ? [quantityError] : undefined} />
      </Field>
      <Field data-invalid={Boolean(costPerUnitError)}>
        <FieldLabel htmlFor="production-cost-per-unit">Cost per unit</FieldLabel>
        <Input aria-invalid={Boolean(costPerUnitError)} id="production-cost-per-unit" inputMode="decimal" min="0" placeholder="0.00" step="0.01" type="number" {...form.register("costPerUnit")} />
        <FieldDescription>Enter the production cost in Thai baht.</FieldDescription>
        <FieldError errors={costPerUnitError ? [costPerUnitError] : undefined} />
      </Field>
      {errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}
      <Button disabled={recordBatch.isPending} type="submit">
        {recordBatch.isPending ? "Recording…" : "Record production"}
      </Button>
    </form>
  );
}
