export const counterKeys = {
  all: ["counter"] as const,
  currentSession: () => [...counterKeys.all, "current-session"] as const,
  receipt: (token: string) => [...counterKeys.all, "receipt", token] as const,
};
