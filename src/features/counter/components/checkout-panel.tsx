"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Product } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmptyState } from "@/components/shared/empty-state";
import { applyApiErrorToForm, getApiErrorMessage } from "@/lib/errors";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useCreateSale } from "../hooks/use-create-sale";
import { checkoutFormSchema, type CheckoutFormValues, type Sale } from "../schemas";

type CheckoutLine = {
  product: Product;
  productId: string;
  quantity: number;
};

type CheckoutPanelProps = {
  items: CheckoutLine[];
  onAddProduct: (productId: string) => void;
  onClear: () => void;
  onDecreaseProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
  total: number;
};

export function CheckoutPanel({
  items,
  onAddProduct,
  onClear,
  onDecreaseProduct,
  onRemoveProduct,
  total,
}: CheckoutPanelProps) {
  const checkout = useCreateSale();
  const form = useForm<CheckoutFormValues>({
    defaultValues: { paymentMethod: "CASH" },
    resolver: zodResolver(checkoutFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: CheckoutFormValues) {
    setErrorMessage(null);

    try {
      const sale = await checkout.mutateAsync({
        lineItems: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        paymentMethod: values.paymentMethod,
      });
      onClear();
      toast.success("Sale completed");
      return sale;
    } catch (error) {
      applyApiErrorToForm(error, form);
      setErrorMessage(getApiErrorMessage(error, "The sale could not be completed."));
      return null;
    }
  }

  if (checkout.data) {
    return <SaleCompleted sale={checkout.data} onStartNewSale={() => checkout.reset()} />;
  }

  if (items.length === 0) {
    return <EmptyState description="Select a product to start a new sale." title="Your cart is empty" />;
  }

  const paymentMethodError = form.formState.errors.paymentMethod;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Current sale</h2>
          <p className="text-sm text-muted-foreground">Review items before checkout.</p>
        </div>
        <Button aria-label="Clear cart" onClick={onClear} size="icon-sm" variant="ghost">
          <Trash2 />
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div className="flex items-center justify-between gap-3" key={item.productId}>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} × {formatCurrency(item.product.price)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button aria-label={`Decrease ${item.product.name}`} onClick={() => onDecreaseProduct(item.productId)} size="icon-xs" variant="ghost">
                <Minus />
              </Button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <Button aria-label={`Increase ${item.product.name}`} onClick={() => onAddProduct(item.productId)} size="icon-xs" variant="ghost">
                <Plus />
              </Button>
              <Button aria-label={`Remove ${item.product.name}`} onClick={() => onRemoveProduct(item.productId)} size="icon-xs" variant="ghost">
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <form className="space-y-5" onSubmit={(event) => void form.handleSubmit(handleSubmit)(event)}>
        <Controller
          control={form.control}
          name="paymentMethod"
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend>Payment method</FieldLegend>
              <FieldDescription>Select how the customer will pay.</FieldDescription>
              <RadioGroup
                aria-invalid={fieldState.invalid}
                onValueChange={field.onChange}
                value={field.value}
              >
                <Field orientation="horizontal">
                  <RadioGroupItem id="payment-cash" value="CASH" />
                  <FieldLabel htmlFor="payment-cash">Cash</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem id="payment-promptpay" value="PROMPTPAY" />
                  <FieldLabel htmlFor="payment-promptpay">PromptPay</FieldLabel>
                </Field>
              </RadioGroup>
              <FieldError errors={paymentMethodError ? [paymentMethodError] : undefined} />
            </FieldSet>
          )}
        />
        {errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}
        <Button className="w-full" disabled={checkout.isPending} type="submit">
          {checkout.isPending ? "Completing sale…" : `Complete sale · ${formatCurrency(total)}`}
        </Button>
      </form>
    </div>
  );
}

type SaleCompletedProps = {
  onStartNewSale: () => void;
  sale: Sale;
};

function SaleCompleted({ onStartNewSale, sale }: SaleCompletedProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-primary">Sale completed</p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">Receipt ready</h2>
        <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(sale.soldAt)}</p>
      </div>
      <div className="rounded-xl bg-muted/50 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Payment</span>
          <span className="font-medium">{sale.paymentMethod === "PROMPTPAY" ? "PromptPay" : "Cash"}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>
      </div>
      {sale.paymentMethod === "PROMPTPAY" ? (
        sale.promptpayQrPayload ? (
          <div className="rounded-xl border bg-white p-4 text-center">
            <p className="font-medium text-foreground">Scan to pay with PromptPay</p>
            <div className="mt-4 flex justify-center">
              <QRCodeSVG
                bgColor="#ffffff"
                fgColor="#111827"
                includeMargin
                level="M"
                size={220}
                title={`PromptPay QR for ${formatCurrency(sale.total)}`}
                value={sale.promptpayQrPayload}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Payment is not confirmed automatically. Verify payment before handing over the order.
            </p>
          </div>
        ) : (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="alert">
            The PromptPay QR code is unavailable for this sale.
          </p>
        )
      ) : null}
      {sale.stockWarning ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="status">
          This sale was accepted, but recorded production quantity may be lower than completed sales.
        </p>
      ) : null}
      <div className="flex flex-col gap-2">
        <Button nativeButton={false} render={<Link href={sale.receiptUrl} target="_blank" />} variant="outline">
          <ExternalLink />
          Open receipt
        </Button>
        <Button onClick={onStartNewSale} variant="ghost">
          Start new sale
        </Button>
      </div>
    </div>
  );
}
