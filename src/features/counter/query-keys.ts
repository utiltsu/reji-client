export const counterKeys = {
  all: ["counter"] as const,
  products: () => [...counterKeys.all, "products"] as const,
  receipt: (token: string) => [...counterKeys.all, "receipt", token] as const,
};
