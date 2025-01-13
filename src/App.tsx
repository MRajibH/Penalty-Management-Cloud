import { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { Penalty, SearchFilters } from "./types";
import { PenaltyCard } from "./components/PenaltyCard";
import { Stats } from "./components/Stats";
import { AddPenaltyForm } from "./components/AddPenaltyForm";
import { SearchBar } from "./components/SearchBar";
import { Filters } from "./components/Filters";
import { penaltyCollectionRef } from "./db/firebase.db";
import { addDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Button } from "./components/ui/button";

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

function App() {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
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
    pendingAmount: penalties.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0),
    paidAmount: penalties.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0),
  };

  const handleAddPenalty = async (newPenalty: Omit<Penalty, "id" | "status">) => {
    await addDoc(penaltyCollectionRef, {
      ...newPenalty,
      id: Date.now().toString(),
      status: "PENDING",
    });
    // setDoc(penaltyRef, {panelties:[
    //   ...penalties,
    //   {
    //     ...newPenalty,
    //     id: Date.now().toString(),
    //     status: 'PENDING',
    //   },
    // ]});
  };

  const handleStatusChange = (id: string, newStatus: Penalty["status"]) => {
    const docRef = doc(penaltyCollectionRef, id);
    updateDoc(docRef, { status: newStatus });
  };

  const filteredPenalties = useMemo(() => {
    return penalties.filter((penalty) => {
      const matchesSearch = filters.search
        ? penalty.engineerName.toLowerCase().includes(filters.search.toLowerCase()) ||
          penalty.reason.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchesDepartment = filters.department === "ALL" || penalty.department === filters.department;
      const matchesStatus = filters.status === "ALL" || penalty.status === filters.status;

      const matchesDateRange =
        (!filters.dateRange.start || penalty.date >= filters.dateRange.start) &&
        (!filters.dateRange.end || penalty.date <= filters.dateRange.end);

      return matchesSearch && matchesDepartment && matchesStatus && matchesDateRange;
    });
  }, [penalties, filters]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Penalty Management System</h1>
          {/* <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Penalty
          </button> */}
          <Button onClick={() => setShowAddForm(true)}>
            <Plus />
            Add Penalty
          </Button>
        </div>

        <Stats stats={stats} />

        <div className="space-y-4 mb-6">
          <SearchBar value={filters.search} onChange={(value) => setFilters({ ...filters, search: value })} />
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPenalties.map((penalty) => (
            <PenaltyCard key={penalty.id} penalty={penalty} onStatusChange={handleStatusChange} />
          ))}
        </div>

        {filteredPenalties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No penalties found</p>
          </div>
        )}

        {showAddForm && <AddPenaltyForm onAdd={handleAddPenalty} onClose={() => setShowAddForm(false)} />}
      </div>
    </div>
  );
}

export default App;
