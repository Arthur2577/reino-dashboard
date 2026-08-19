import { Card } from "./Card";

type StatCardProps = {
  label: string;
  value: string | number;
  color?: string;
};

export function StatCard({ label, value, color = "text-white" }: StatCardProps) {
  return (
    <Card>
      <p className="text-xs uppercase text-text-secondary">{label}</p>
      <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
    </Card>
  );
}
