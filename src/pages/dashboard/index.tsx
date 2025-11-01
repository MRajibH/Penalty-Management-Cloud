import { Stats } from "@/components/Stats";
import { useDataContext } from "@/context";

const today = new Date();
const last30Days = new Date();
last30Days.setDate(today.getDate() - 30);

const Dashboard = () => {
  const { penaltyData } = useDataContext();

  const stats = {
    totalPenalties: penaltyData.length,
    totalAmount: penaltyData.reduce((sum, p) => sum + Number(p.amount), 0),
    pendingAmount: penaltyData
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + Number(p.amount), 0),
    paidAmount: penaltyData
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + Number(p.amount), 0),
  };

  return (
    <div className="p-6 mx-auto grid gap-8">
      <Stats stats={stats} />
    </div>
  );
};

export default Dashboard;
