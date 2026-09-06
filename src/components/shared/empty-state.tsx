import { PackageOpen } from "lucide-react";

type EmptyStateProps = {
  description?: string;
  title?: string;
};

export function EmptyState({ description = "There is nothing to show yet.", title = "No data yet" }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <PackageOpen className="mx-auto mb-3 text-slate-400" />
      <p className="font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
