import { Cookie } from "lucide-react";
import { clientEnv } from "@/lib/env";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <Cookie aria-hidden="true" className="size-7 text-primary" strokeWidth={3} />
      <span className="text-lg font-semibold tracking-tight text-primary">{clientEnv.NEXT_PUBLIC_APP_NAME}</span>
    </span>
  );
}
