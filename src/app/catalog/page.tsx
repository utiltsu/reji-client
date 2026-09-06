import { SessionGuard } from "@/features/auth/components/session-guard";
import { ProductsScreen } from "@/features/products/components/products-screen";

export default function CatalogPage() {
  return (
    <SessionGuard requiredRole="OWNER">
      <ProductsScreen />
    </SessionGuard>
  );
}
