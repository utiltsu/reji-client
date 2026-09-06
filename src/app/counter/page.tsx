import { CounterScreen } from "@/features/counter/components/counter-screen";
import { SessionGuard } from "@/features/auth/components/session-guard";

export default function CounterPage() {
  return (
    <SessionGuard>
      <CounterScreen />
    </SessionGuard>
  );
}
