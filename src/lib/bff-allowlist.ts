export const BFF_ALLOWLIST = [
  "tasks",
  "sessions",
  "products",
  "sales",
  "production-batches",
  "leftover-records",
  "r",
] as const;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECEIPT_TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;

export function isAllowedBffPath(path: string) {
  const segments = path.split("/");
  const resource = segments[0];

  if (!resource || !BFF_ALLOWLIST.includes(resource as (typeof BFF_ALLOWLIST)[number])) {
    return false;
  }

  if (resource === "r") {
    return segments.length === 2 && RECEIPT_TOKEN_PATTERN.test(segments[1] ?? "");
  }

  if (segments.length === 1) {
    return true;
  }

  return (
    segments.length === 3 &&
    UUID_PATTERN.test(segments[1] ?? "") &&
    ((resource === "sessions" && segments[2] === "close") ||
      (resource === "sales" && segments[2] === "cancel"))
  );
}
