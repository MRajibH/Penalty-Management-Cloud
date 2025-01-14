import { AddPenaltyForm } from "@/components/AddPenaltyForm";
import { Filters } from "@/components/Filters";
import { PenaltyCard } from "@/components/PenaltyCard";
import { SearchBar } from "@/components/SearchBar";
import { Stats } from "@/components/Stats";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/authContext";
import { penaltyCollectionRef } from "@/db/firebase.db";
import { cn } from "@/lib/utils";
import { Penalty, SearchFilters } from "@/types";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { LogIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const today = new Date();
const last30Days = new Date();
last30Days.setDate(today.getDate() - 30);

const initialFilters: SearchFilters = {
  search: "",
  department: "DevSecOps",
  status: "PENDING",
  dateRange: {
    start: last30Days.toISOString().split("T")[0], // Format as YYYY-MM-DD
    end: today.toISOString().split("T")[0], // Format as YYYY-MM-DD
  },
};

const Dashboard = () => {
  const { isLoggedIn } = useAuthContext();
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

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

  const handleStatusChange = (id: string, newStatus: Penalty["status"]) => {
    const docRef = doc(penaltyCollectionRef, id);
    updateDoc(docRef, { status: newStatus });
  };

  const filteredPenalties = useMemo(() => {
    return penalties.filter((penalty) => {
      const matchesSearch = filters.search
        ? penalty.engineerName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          penalty.reason.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchesDepartment =
        filters.department === "ALL" ||
        penalty.department === filters.department;
      const matchesStatus =
        filters.status === "ALL" || penalty.status === filters.status;

      const matchesDateRange =
        (!filters.dateRange.start || penalty.date >= filters.dateRange.start) &&
        (!filters.dateRange.end || penalty.date <= filters.dateRange.end);

      return (
        matchesSearch && matchesDepartment && matchesStatus && matchesDateRange
      );
    });
  }, [penalties, filters]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto px-8 py-8">
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

        <Card>
          <CardHeader className="flex flex-row gap-4">
            <SearchBar
              value={filters.search}
              className="min-w-[450px]"
              onChange={(value) => setFilters({ ...filters, search: value })}
            />
            <Filters filters={filters} onFilterChange={setFilters} />
          </CardHeader>
        </Card>
        <div className="space-y-4 mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPenalties.map((penalty) => (
            <PenaltyCard
              key={penalty.id}
              penalty={penalty}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredPenalties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No penalties found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
