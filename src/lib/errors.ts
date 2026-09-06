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
