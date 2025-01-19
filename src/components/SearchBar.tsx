import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { FormItem } from "./ui/form";

interface SearchBarProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <FormItem className={cn("my-auto", className)}>
      <Label>Search</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          value={value}
          className="bg-white pl-8"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by engineer name or reason..."
        />
      </div>
    </FormItem>
  );
}
