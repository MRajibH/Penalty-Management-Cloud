import { Filters } from "@/components/Filters";
import { PenaltyCard } from "@/components/PenaltyCard";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { penaltyCollectionRef } from "@/db/firebase.db";
import { Penalty, SearchFilters } from "@/types";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { IoFilter } from "react-icons/io5";

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

const PenaltyData = () => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
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
    <div className="grid gap-4 overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IoFilter className="w-6 h-6" />
            Filter Penalty Data
          </CardTitle>
          <div className="flex gap-4">
            <SearchBar
              value={filters.search}
              className="min-w-[450px]"
              onChange={(value) => setFilters({ ...filters, search: value })}
            />
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>
        </CardHeader>
      </Card>

      <Separator />

      <div className="overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPenalties.map((penalty) => (
            <PenaltyCard
              key={penalty.id}
              penalty={penalty}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>

      {filteredPenalties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No penalties found</p>
        </div>
      )}
    </div>
  );
};

export default PenaltyData;
