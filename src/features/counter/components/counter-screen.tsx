import { Button } from "@/components/ui/button";

export function CounterScreen() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-medium text-amber-700">ขั้นตอนถัดไป</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">ขายหน้าร้าน</h1>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          หน้าขายจะเชื่อมกับสินค้า ตะกร้า Cash Session และ checkout ในขั้นตอนถัดไป
        </p>
        <Button className="mt-6" disabled>
          เปิด Cash Session
        </Button>
      </div>
    </main>
  );
}
