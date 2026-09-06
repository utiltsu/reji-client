import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

const API_ERROR_MESSAGES: Record<string, string> = {
  CHECKOUT_ALREADY_SUBMITTED: "This PromptPay checkout was already submitted.",
  CHECKOUT_EXPIRED: "This PromptPay QR has expired. Generate a new QR.",
  CHECKOUT_NOT_FOUND: "This PromptPay checkout is no longer available. Generate a new QR.",
  CHECKOUT_TOKEN_REQUIRED: "Generate a PromptPay QR before submitting the sale.",
  INVALID_CHECKOUT_REQUEST: "The checkout details are invalid. Review the cart and try again.",
  LEFTOVERS_NOT_RECONCILED: "Record the day's leftovers before closing this session.",
  NO_OPEN_SESSION: "Open a cash session before checking out a sale.",
  PRODUCT_NOT_FOUND: "One of the selected products is no longer available.",
  PROMPTPAY_NOT_CONFIGURED: "PromptPay is not configured for this shop.",
  SESSION_ALREADY_CLOSED: "This cash session is already closed.",
  SESSION_ALREADY_OPEN: "A cash session is already open.",
};

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, public readonly requestId: string | undefined, public readonly fieldErrors: Record<string, string> = {}) {
    super("The request could not be completed");
  }

  static fromResponse(status: number, body: unknown) {
    const payload = typeof body === "object" && body !== null ? body as { code?: string; requestId?: string; fieldErrors?: Record<string, Array<{ message?: string }>> } : {};
    const fieldErrors = Object.fromEntries(Object.entries(payload.fieldErrors ?? {}).map(([key, errors]) => [key, errors[0]?.message ?? "The value is invalid"]));
    return new ApiError(status, payload.code ?? "REQUEST_FAILED", payload.requestId, fieldErrors);
  }
}

export function getApiErrorMessage(error: unknown, fallback = "The request could not be completed.") {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  return API_ERROR_MESSAGES[error.code] ?? fallback;
}

export function applyApiErrorToForm<TFieldValues extends FieldValues>(
  error: unknown,
  form: UseFormReturn<TFieldValues>,
) {
  if (!(error instanceof ApiError)) {
    return false;
  }

  for (const [field, message] of Object.entries(error.fieldErrors)) {
    form.setError(field as FieldPath<TFieldValues>, {
      message,
      type: "server",
    });
  }

  return Object.keys(error.fieldErrors).length > 0;
}
