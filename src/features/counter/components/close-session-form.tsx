"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { applyApiErrorToForm, getApiErrorMessage } from "@/lib/errors";
import { closeCashSessionFormSchema, type CloseCashSessionFormValues } from "../schemas";

type CloseSessionFormProps = {
  isPending: boolean;
  onSubmit: (values: CloseCashSessionFormValues) => Promise<void>;
};

export function CloseSessionForm({ isPending, onSubmit }: CloseSessionFormProps) {
  const form = useForm<CloseCashSessionFormValues>({
    defaultValues: { closingCountedCash: "" },
    resolver: zodResolver(closeCashSessionFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const closingCountedCashError = form.formState.errors.closingCountedCash;

  async function handleSubmit(values: CloseCashSessionFormValues) {
    setErrorMessage(null);

    try {
      await onSubmit(values);
    } catch (error) {
      applyApiErrorToForm(error, form);
      setErrorMessage(getApiErrorMessage(error, "The cash session could not be closed."));
    }
  }

  return (
    <form className="space-y-4" onSubmit={(event) => void form.handleSubmit(handleSubmit)(event)}>
      <Field data-invalid={Boolean(closingCountedCashError)}>
        <FieldLabel htmlFor="closing-counted-cash">Counted cash</FieldLabel>
        <Input
          aria-invalid={Boolean(closingCountedCashError)}
          id="closing-counted-cash"
          inputMode="decimal"
          min="0"
          placeholder="0.00"
          step="0.01"
          type="number"
          {...form.register("closingCountedCash")}
        />
        <FieldDescription>Count the cash in the drawer in Thai baht.</FieldDescription>
        <FieldError errors={closingCountedCashError ? [closingCountedCashError] : undefined} />
      </Field>
      {errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}
      <Button disabled={isPending} type="submit" variant="outline">
        {isPending ? "Closing session…" : "Close cash session"}
      </Button>
    </form>
  );
}
