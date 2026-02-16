import PenaltyAmountByDate from "@/components/pages/dashboard/PenaltyAmountByDate";
import PenaltyAmountByEmployee from "@/components/pages/dashboard/PenaltyAmountByEmployee";
import PenaltyByReason from "@/components/pages/dashboard/PenaltyByReason";
import { Stats } from "@/components/pages/dashboard/Stats";
import { useDataContext } from "@/context";

const today = new Date();
const last30Days = new Date();
last30Days.setDate(today.getDate() - 30);

const Dashboard = () => {
  const { penaltyData } = useDataContext();

  const stats = {
    totalPenalties: penaltyData.length,
    totalAmount: penaltyData.reduce((sum, p) => sum + Number(p.amount), 0),
    pendingAmount: penaltyData.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + Number(p.amount), 0),
    paidAmount: penaltyData.filter((p) => p.status === "PAID").reduce((sum, p) => sum + Number(p.amount), 0),
  };

  return (
    <div className="p-6 mx-auto grid gap-8">
      <Stats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="col-span-1 xl:col-span-2">
          <PenaltyAmountByDate />
        </div>
        <div className="col-span-1">
          <PenaltyByReason />
        </div>
        <div className="col-span-3">
          <PenaltyAmountByEmployee />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
