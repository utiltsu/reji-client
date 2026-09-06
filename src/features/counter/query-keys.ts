export const counterKeys = {
  all: ["counter"] as const,
  receipt: (token: string) => [...counterKeys.all, "receipt", token] as const,
};
