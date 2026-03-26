import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  count: number;
  label: string;
}

export default function AdminStatCard({ icon: Icon, count, label }: Props) {
  return (
    <div className="bg-surface-elevated rounded-xl p-5 flex items-center gap-4">
      <Icon size={32} className="text-primary" />
      <div>
        <p className="text-3xl font-bold">{count}</p>
        <p className="text-text-secondary text-sm">{label}</p>
      </div>
    </div>
  );
}
