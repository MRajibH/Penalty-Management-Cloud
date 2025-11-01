import { Stats } from "@/components/Stats";
import { Separator } from "@/components/ui/separator";
import { penaltyCollectionRef } from "@/db/firebase.db";
import { Penalty } from "@/types";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const today = new Date();
const last30Days = new Date();
last30Days.setDate(today.getDate() - 30);

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
    paidAmount: penalties.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="p-6 mx-auto grid gap-8">
      <Stats stats={stats} />
    </div>
  );
};

export default Dashboard;
