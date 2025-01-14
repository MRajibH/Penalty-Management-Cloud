import { Stats } from "@/components/Stats";
import { penaltyCollectionRef } from "@/db/firebase.db";
import { Penalty } from "@/types";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import PenaltyBarChart from "./components/PenaltyBarChart";
import PenaltyPieChart from "./components/PenaltyPieChart";
import PenaltyBarChartHorizontal from "./components/PenaltyBarChartHorizontal";
import PenaltyBarChartExtended from "./components/PenaltyBarChartExtended";

const Dashboard = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);

  useEffect(() => {
    const unscubscribe = onSnapshot(penaltyCollectionRef, (snapshot) => {
      const panelties: any = [];
      snapshot.forEach((doc) => {
        panelties.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      setPenalties(panelties);
    });

    return () => {
      unscubscribe();
    };
  }, []);

  const stats = {
    totalPenalties: penalties.length,
    totalAmount: penalties.reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: penalties
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + p.amount, 0),
    paidAmount: penalties
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="min-h-screen p-4">
      <div className="">
        {/* <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Penalty Management System
          </h1>

          {isLoggedIn ? (
            <AddPenaltyForm />
          ) : (
            <Link
              to={"/login"}
              className={cn(
                buttonVariants({
                  variant: "default",
                })
              )}
            >
              Login
              <LogIn />
            </Link>
          )}
        </div> */}

        <Stats stats={stats} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PenaltyPieChart />
          <PenaltyBarChart />
          <PenaltyBarChartHorizontal />
          <PenaltyBarChartExtended />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
