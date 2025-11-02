import { Filters } from "@/components/Filters";
import { SearchBar } from "@/components/SearchBar";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SearchFilters } from "@/types";
import { useState } from "react";
import { IoFilter } from "react-icons/io5";
import { CreatePenalty, processPenaltyData } from "./utils";
import { useDataContext } from "@/context";
import { PenaltyCard } from "@/components/PenaltyCard";

const today = new Date();
const last1year = new Date();
last1year.setDate(today.getDate() - 365);

const Penalties = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    department: "DevSecOps",
    status: "PENDING",
    dateRange: {
      start: last1year.toISOString().split("T")[0], // Format as YYYY-MM-DD
      end: today.toISOString().split("T")[0], // Format as YYYY-MM-DD
    },
  });
  const dataContext = useDataContext();
  const userPermissions = dataContext.userPermissions;
  const canCreatePenalty = userPermissions?.overview?.penalties?.includes("create");

  const processedPenaltyData = processPenaltyData(dataContext, filters);

  return (
    <div className="mx-auto grid gap-8 pb-8">
      <div className="flex flex-col gap-4 sticky top-[-48px] left-0 right-0 z-10 bg-blue-50/25 backdrop-blur-lg shadow">
        <CardHeader className="px-16 pt-4 pb-0 gap-2">
          <CardTitle className="flex items-center gap-2">
            <IoFilter className="w-6 h-6" />
            Filter Penalty Data
          </CardTitle>
          <div className="flex flex-col xl:flex-row gap-4">
            <SearchBar
              value={filters.search}
              className="min-w-[320px] flex-1"
              onChange={(value) => setFilters({ ...filters, search: value })}
            />
            <Filters filters={filters} onFilterChange={setFilters} />

            {canCreatePenalty && (
              <div className="absolute right-6 top-6">
                <CreatePenalty />
              </div>
            )}
          </div>
        </CardHeader>
        <Separator/>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {processedPenaltyData.map((penalty, index) => (
          <PenaltyCard key={index} penalty={penalty} filters={filters} />
        ))}
      </div>

      {processedPenaltyData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No penalties found</p>
        </div>
      )}
    </div>
  );
};

export default Penalties;
