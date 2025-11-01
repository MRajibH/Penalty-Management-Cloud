import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useBoolean from "@/hooks/use-boolean";
import { Plus } from "lucide-react";
import { PenaltyForm } from "./PenaltyForm";
import { DataContextType } from "@/context/data-context/types";
import { SearchFilters } from "@/types";

export const processPenaltyData = (props: DataContextType, filters: SearchFilters) => {
  const { penaltyData, employeeMapped, penaltyReasonMapped, designationMapped, departmentMapped } =
    props;
  const employeeIds = Array.from(new Set(penaltyData.map((penalty) => penalty.employee_id)));

  return employeeIds
    .map((employeeId) => {
      const penalties = penaltyData
        .filter((data) => data.employee_id === employeeId)
        .filter((data) => {
          if (filters.status === "ALL") return true;
          if (filters.status === "PENDING") return data.status === "PENDING";
          if (filters.status === "PAID") return data.status === "PAID";
          if (filters.status === "DISPUTED") return data.status === "DISPUTED";
          return false;
        })
        // filter by date range
        .filter((data) => {
          if (!filters.dateRange.start && !filters.dateRange.end) return true;
          if (filters.dateRange.start && filters.dateRange.end)
            return data.date >= filters.dateRange.start && data.date <= filters.dateRange.end;
          if (filters.dateRange.start) return data.date >= filters.dateRange.start;
          if (filters.dateRange.end) return data.date <= filters.dateRange.end;
          return false;
        })
        .map((penalty) => {
          return {
            ...penalty,
            reason: penaltyReasonMapped[penalty.reason_id],
          };
        });

      const employee = employeeMapped[employeeId];
      const designation = designationMapped[employee.designation_id];
      const department = departmentMapped[designation.department_id];

      return {
        employee,
        designation,
        department,
        penalties,
      };
    })
    .filter((penalty) => penalty.penalties.length > 0)
    .filter((penalty) => {
      if (filters.search)
        return penalty.employee.name.toLowerCase().includes(filters.search.toLowerCase());
      return true;
    });
};

export const CreatePenalty = () => {
  const { open, setOpen, onClose } = useBoolean(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          Add Penalty
          <Plus />
        </Button>
      </SheetTrigger>

      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add Penalty</SheetTitle>
          <SheetDescription>Create a new Penalty.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <PenaltyForm onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};
