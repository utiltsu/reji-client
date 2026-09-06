"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { applyApiErrorToForm, getApiErrorMessage } from "@/lib/errors";
import { openCashSessionFormSchema, type OpenCashSessionFormValues } from "../schemas";

type OpenSessionFormProps = {
  isPending: boolean;
  onSubmit: (values: OpenCashSessionFormValues) => Promise<void>;
};

export function OpenSessionForm({ isPending, onSubmit }: OpenSessionFormProps) {
  const form = useForm<OpenCashSessionFormValues>({
    defaultValues: { openingFloat: "" },
    resolver: zodResolver(openCashSessionFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openingFloatError = form.formState.errors.openingFloat;

  async function handleSubmit(values: OpenCashSessionFormValues) {
    setErrorMessage(null);

    try {
      await onSubmit(values);
    } catch (error) {
      applyApiErrorToForm(error, form);
      setErrorMessage(getApiErrorMessage(error, "The cash session could not be opened."));
    }
  }

  return (
    <form className="space-y-5" onSubmit={(event) => void form.handleSubmit(handleSubmit)(event)}>
      <Field data-invalid={Boolean(openingFloatError)}>
        <FieldLabel htmlFor="opening-float">Opening cash</FieldLabel>
        <Input
          aria-invalid={Boolean(openingFloatError)}
          id="opening-float"
          inputMode="decimal"
          min="0"
          placeholder="0.00"
          step="0.01"
          type="number"
          {...form.register("openingFloat")}
        />
        <FieldDescription>Enter the starting cash in Thai baht.</FieldDescription>
        <FieldError errors={openingFloatError ? [openingFloatError] : undefined} />
      </Field>
      {errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "Opening session…" : "Open cash session"}
      </Button>
    </form>
  );
}
