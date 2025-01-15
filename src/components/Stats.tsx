import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { PenaltyStats } from "../types";
import { BDT } from "./PenaltyCard";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface StatsProps {
  stats: PenaltyStats;
}

type GenericStatsProps = {
  label?: string;
  icon?: JSX.Element;
  count?: string | number;
  color?: "blue" | "green" | "yellow" | "cyan";
};

const GenericStats = ({ label, count, icon, color }: GenericStatsProps) => {
  return (
    <>
      <Card className="relative flex items-center overflow-hidden min-h-32">
        <CardHeader className="gap-2">
          <CardTitle className="font-extrabold text-2xl">{count}</CardTitle>
          <CardDescription className="font-bold text-gray-400">
            {label}
          </CardDescription>
        </CardHeader>
        <div
          className={`absolute h-28 w-40 bg-gradient-to-r from-${color}-100 rounded-3xl rotate-45 right-[-80px]`}
        />
        <div className="absolute right-[30px] top-9">{icon}</div>
      </Card>
    </>
  );
};

export function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <GenericStats
        color="blue"
        label={"Total Penalties"}
        count={stats.totalPenalties}
        icon={<AlertCircle className="w-6 h-6 text-blue-600" />}
      />
      <GenericStats
        color="green"
        label={"Paid Amount"}
        count={"৳ " + stats.paidAmount}
        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
      />

      <GenericStats
        color="yellow"
        label={"Pending Amount"}
        count={"৳ " + stats.pendingAmount}
        icon={<Clock className="w-6 h-6 text-yellow-600" />}
      />

      <GenericStats
        color="cyan"
        label={"Total Amount"}
        count={"৳ " + stats.totalAmount}
        icon={<BDT className="w-6 h-6 text-cyan-600" />}
      />
    </div>
  );
}
