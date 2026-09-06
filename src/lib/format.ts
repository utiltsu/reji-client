const CURRENCY_FORMATTER = new Intl.NumberFormat("en-TH", {
  currency: "THB",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-TH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Bangkok",
});

export function formatCurrency(amountInSatang: number) {
  return CURRENCY_FORMATTER.format(amountInSatang / 100);
}

export function formatDateTime(value: string) {
  return DATE_TIME_FORMATTER.format(new Date(value));
}

export function bahtToSatang(value: string) {
  const [wholePart, fractionPart = ""] = value.trim().split(".");
  return Number(wholePart) * 100 + Number(fractionPart.padEnd(2, "0"));
}
