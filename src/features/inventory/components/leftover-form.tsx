"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { applyApiErrorToForm, getApiErrorMessage } from "@/lib/errors";
import { useRecordLeftover } from "../hooks/use-record-leftover";
import { leftoverCauseSchema, leftoverFormSchema, type LeftoverFormValues } from "../schemas";
import { ProductSelectField } from "./product-select-field";
import type { Product } from "@/hooks/use-products";

const leftoverCauses = leftoverCauseSchema.options;

type LeftoverFormProps = {
  products: Product[];
};

export function LeftoverForm({ products }: LeftoverFormProps) {
  const record = useRecordLeftover();
  const form = useForm<LeftoverFormValues>({
    defaultValues: { businessDate: "", cause: "DISCARDED", note: "", productId: "", quantity: "" },
    resolver: zodResolver(leftoverFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: LeftoverFormValues) {
    setErrorMessage(null);

    try {
      await record.mutateAsync({
        businessDate: values.businessDate,
        cause: values.cause,
        note: values.note.trim() || null,
        productId: values.productId,
        quantity: Number(values.quantity),
      });
      form.reset({ businessDate: values.businessDate, cause: values.cause, note: "", productId: "", quantity: "" });
      toast.success("Leftover recorded");
    } catch (error) {
      applyApiErrorToForm(error, form);
      setErrorMessage(getApiErrorMessage(error, "The leftover could not be recorded."));
    }
  }

  const businessDateError = form.formState.errors.businessDate;
  const quantityError = form.formState.errors.quantity;
  const causeError = form.formState.errors.cause;
  const noteError = form.formState.errors.note;

  return (
    <form className="space-y-5" onSubmit={(event) => void form.handleSubmit(handleSubmit)(event)}>
      <ProductSelectField control={form.control} name="productId" products={products} />
      <Field data-invalid={Boolean(businessDateError)}>
        <FieldLabel htmlFor="leftover-business-date">Business date</FieldLabel>
        <Input aria-invalid={Boolean(businessDateError)} id="leftover-business-date" type="date" {...form.register("businessDate")} />
        <FieldDescription>Use the shop&apos;s Bangkok business date.</FieldDescription>
        <FieldError errors={businessDateError ? [businessDateError] : undefined} />
      </Field>
      <Field data-invalid={Boolean(quantityError)}>
        <FieldLabel htmlFor="leftover-quantity">Quantity</FieldLabel>
        <Input aria-invalid={Boolean(quantityError)} id="leftover-quantity" inputMode="numeric" min="1" step="1" type="number" {...form.register("quantity")} />
        <FieldError errors={quantityError ? [quantityError] : undefined} />
      </Field>
      <Controller
        control={form.control}
        name="cause"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="leftover-cause">Cause</FieldLabel>
            <Select onValueChange={(value) => field.onChange(value ?? "")} value={field.value}>
              <SelectTrigger aria-invalid={fieldState.invalid} id="leftover-cause">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leftoverCauses.map((cause) => (
                  <SelectItem key={cause} value={cause}>
                    {cause === "TAKEN_HOME" ? "Taken home" : cause === "GIVEN_AWAY" ? "Given away" : "Discarded"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={causeError ? [causeError] : undefined} />
          </Field>
        )}
      />
      <Field data-invalid={Boolean(noteError)}>
        <FieldLabel htmlFor="leftover-note">Note</FieldLabel>
        <Textarea aria-invalid={Boolean(noteError)} id="leftover-note" placeholder="Optional note" {...form.register("note")} />
        <FieldError errors={noteError ? [noteError] : undefined} />
      </Field>
      {errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}
      <Button disabled={record.isPending} type="submit">
        {record.isPending ? "Recording…" : "Record leftover"}
      </Button>
    </form>
  );
}
