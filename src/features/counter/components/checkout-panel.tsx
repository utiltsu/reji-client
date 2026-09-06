"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, ExternalLink, Minus, Plus, Trash2 } from "lucide-react";
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
import { ApiError, applyApiErrorToForm, getApiErrorMessage } from "@/lib/errors";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useCreateSale } from "../hooks/use-create-sale";
import { usePreparePromptPayCheckout } from "../hooks/use-prepare-promptpay-checkout";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
  type PaymentMethod,
  type PromptPayCheckoutPreparation,
  type Sale,
} from "../schemas";

type CheckoutLine = {
  product: Product;
  productId: string;
  quantity: number;
};

export type CheckoutPanelProps = {
  isCartLocked: boolean;
  items: CheckoutLine[];
  onAddProduct: (productId: string) => void;
  onClear: () => void;
  onDecreaseProduct: (productId: string) => void;
  onLockCart: (isLocked: boolean) => void;
  onRemoveProduct: (productId: string) => void;
  total: number;
};

export function CheckoutPanel({
  isCartLocked,
  items,
  onAddProduct,
  onClear,
  onDecreaseProduct,
  onLockCart,
  onRemoveProduct,
  total,
}: CheckoutPanelProps) {
  const checkout = useCreateSale();
  const preparePromptPay = usePreparePromptPayCheckout();
  const form = useForm<CheckoutFormValues>({
    defaultValues: { paymentMethod: "CASH" },
    resolver: zodResolver(checkoutFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("CASH");
  const preparation = preparePromptPay.data;

  function handleStartNewSale() {
    checkout.reset();
    preparePromptPay.reset();
    onLockCart(false);
  }

  function handleStartOver() {
    preparePromptPay.reset();
    setErrorMessage(null);
    form.clearErrors();
    onLockCart(false);
  }

  async function handleSubmit(values: CheckoutFormValues) {
    setErrorMessage(null);

    try {
      if (values.paymentMethod === "PROMPTPAY") {
        onLockCart(true);
        await preparePromptPay.mutateAsync({
          lineItems: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          paymentMethod: "PROMPTPAY",
        });
        toast.success("PromptPay QR ready");
        return null;
      }

      const sale = await checkout.mutateAsync({
        lineItems: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        paymentMethod: "CASH",
      });
      onClear();
      toast.success("Sale completed");
      return sale;
    } catch (error) {
      onLockCart(false);
      applyApiErrorToForm(error, form);
      setErrorMessage(getApiErrorMessage(error, "The sale could not be completed."));
      return null;
    }
  }

  async function handleSubmitPrepared() {
    if (!preparation) {
      return null;
    }

    setErrorMessage(null);

    try {
      const sale = await checkout.mutateAsync({
        checkoutToken: preparation.checkoutToken,
        paymentMethod: "PROMPTPAY",
      });
      onClear();
      toast.success("Sale completed");
      return sale;
    } catch (error) {
      applyApiErrorToForm(error, form);
      setErrorMessage(getApiErrorMessage(error, "The PromptPay sale could not be submitted."));
      if (
        error instanceof ApiError &&
        ["CHECKOUT_ALREADY_SUBMITTED", "CHECKOUT_EXPIRED", "CHECKOUT_NOT_FOUND", "NO_OPEN_SESSION"].includes(error.code)
      ) {
        preparePromptPay.reset();
        onLockCart(false);
      }
      return null;
    }
  }

  if (checkout.data) {
    return <SaleCompleted onStartNewSale={handleStartNewSale} sale={checkout.data} />;
  }

  if (preparation) {
    return (
      <PromptPayPreparationView
        errorMessage={errorMessage}
        isPending={checkout.isPending}
        onStartOver={handleStartOver}
        onSubmit={handleSubmitPrepared}
        preparation={preparation}
      />
    );
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
        <Button aria-label="Clear cart" disabled={isCartLocked} onClick={onClear} size="icon-sm" variant="ghost">
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
              <Button aria-label={`Decrease ${item.product.name}`} disabled={isCartLocked} onClick={() => onDecreaseProduct(item.productId)} size="icon-xs" variant="ghost">
                <Minus />
              </Button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <Button aria-label={`Increase ${item.product.name}`} disabled={isCartLocked} onClick={() => onAddProduct(item.productId)} size="icon-xs" variant="ghost">
                <Plus />
              </Button>
              <Button aria-label={`Remove ${item.product.name}`} disabled={isCartLocked} onClick={() => onRemoveProduct(item.productId)} size="icon-xs" variant="ghost">
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
                onValueChange={(value) => {
                  const paymentMethod = value === "PROMPTPAY" ? "PROMPTPAY" : "CASH";
                  field.onChange(paymentMethod);
                  setSelectedPaymentMethod(paymentMethod);
                }}
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
        <Button className="w-full" disabled={checkout.isPending || preparePromptPay.isPending} type="submit">
          {checkout.isPending || preparePromptPay.isPending
            ? valuesInProgress(selectedPaymentMethod)
            : selectedPaymentMethod === "PROMPTPAY"
              ? `Generate QR · ${formatCurrency(total)}`
              : `Complete sale · ${formatCurrency(total)}`}
        </Button>
      </form>
    </div>
  );
}

function valuesInProgress(paymentMethod: CheckoutFormValues["paymentMethod"]) {
  return paymentMethod === "PROMPTPAY" ? "Generating QR…" : "Completing sale…";
}

type PromptPayPreparationViewProps = {
  errorMessage: string | null;
  isPending: boolean;
  onStartOver: () => void;
  onSubmit: () => Promise<Sale | null>;
  preparation: PromptPayCheckoutPreparation;
};

function PromptPayPreparationView({
  errorMessage,
  isPending,
  onStartOver,
  onSubmit,
  preparation,
}: PromptPayPreparationViewProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-primary">PromptPay payment</p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">QR code ready</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask the customer to scan and pay. Submit the sale only after you hear the payment notification.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 text-center">
        <p className="font-medium text-foreground">Scan to pay with PromptPay</p>
        <div className="mt-4 flex justify-center">
          <QRCodeSVG
            bgColor="#ffffff"
            fgColor="#111827"
            includeMargin
            level="M"
            size={220}
            title={`PromptPay QR for ${formatCurrency(preparation.total)}`}
            value={preparation.promptpayQrPayload}
          />
        </div>
        <p className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="size-3" />
          Expires {formatDateTime(preparation.expiresAt)}
        </p>
      </div>

      <div className="space-y-3 rounded-xl bg-muted/50 p-4">
        {preparation.lineItems.map((item) => (
          <div className="flex items-center justify-between gap-3 text-sm" key={item.productId}>
            <span className="min-w-0 truncate text-muted-foreground">
              {item.quantity} × {item.productName}
            </span>
            <span className="shrink-0 font-medium text-foreground">
              {formatCurrency(item.unitPrice * item.quantity - item.discount)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t pt-3 text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(preparation.total)}</span>
        </div>
      </div>

      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="status">
        Payment is not verified automatically. Confirm the payment notification on the shop phone before submitting.
      </p>
      {errorMessage ? <p className="text-sm text-destructive" role="alert">{errorMessage}</p> : null}
      <div className="sticky bottom-0 -mx-5 flex flex-col gap-2 bg-card/95 px-5 pb-1 pt-3 backdrop-blur">
        <Button className="w-full" disabled={isPending} onClick={() => void onSubmit()}>
          {isPending ? "Submitting sale…" : "Submit sale"}
        </Button>
        <Button disabled={isPending} onClick={onStartOver} variant="ghost">
          Start over
        </Button>
      </div>
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
