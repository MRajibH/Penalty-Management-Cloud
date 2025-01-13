import { cn } from "@/lib/utils";
import { Department, SearchFilters } from "../types";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { FormItem } from "./ui/form";
import { Label } from "./ui/label";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { CalendarIcon } from "lucide-react";

interface FiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const departments: Department[] = ["Frontend", "Backend", "DevSecOps", "QA", "Mobile", "Design"];

export function Filters({ filters, onFilterChange }: FiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormItem>
          <Label className="px-1">Department</Label>
          <Select
            value={filters.department}
            onValueChange={(value) => onFilterChange({ ...filters, department: value as Department | "ALL" })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Department</SelectLabel>
                <SelectItem value="ALL">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem>
          <Label className="px-1">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ ...filters, status: value as SearchFilters["status"] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="DISPUTED">Disputed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem>
          <Label className="px-1">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal")}>
                {filters.dateRange.start ? format(filters.dateRange.start, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                onSelect={(date) => {
                  const year = date?.getFullYear();
                  const month = String((date?.getMonth() || 0) + 1).padStart(2, "0"); // Months are 0-indexed
                  const day = String(date?.getDate()).padStart(2, "0"); // Day of the month
                  const value = `${year}-${month}-${day}`;

                  onFilterChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: value },
                  });
                }}
                selected={new Date(filters.dateRange.start)}
                defaultMonth={new Date(filters.dateRange.start)}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                // initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>

        <FormItem>
          <Label className="px-1">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal")}>
                {filters.dateRange.end ? format(filters.dateRange.end, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                onSelect={(date) => {
                  const year = date?.getFullYear();
                  const month = String((date?.getMonth() || 0) + 1).padStart(2, "0"); // Months are 0-indexed
                  const day = String(date?.getDate()).padStart(2, "0"); // Day of the month
                  const value = `${year}-${month}-${day}`;

                  onFilterChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: value },
                  });
                }}
                selected={new Date(filters.dateRange.end)}
                defaultMonth={new Date(filters.dateRange.end)}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                // initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      </div>
    </div>
  );
}
