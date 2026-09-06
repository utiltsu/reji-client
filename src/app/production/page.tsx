import { SessionGuard } from "@/features/auth/components/session-guard";
import { ProductionScreen } from "@/features/inventory/components/production-screen";

export default function ProductionPage() {
  return (
    <SessionGuard>
      <ProductionScreen />
    </SessionGuard>
  );
}
