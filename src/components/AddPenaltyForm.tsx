import React, { useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { Department, Penalty } from "../types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { penaltyCollectionRef } from "@/db/firebase.db";
import { addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const departments: Department[] = ["Frontend", "Backend", "DevSecOps", "QA", "Mobile", "Design"];

const getInitialValue = () => {
  return {
    engineerName: "",
    department: "DevSecOps" as Department,
    reason: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  };
};

export function AddPenaltyForm() {
  const { toast } = useToast();
  const [open, onOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(getInitialValue());

  const addPenalty = async (newPenalty: Omit<Penalty, "id" | "status">) => {
    try {
      setLoading(true);
      await addDoc(penaltyCollectionRef, {
        ...newPenalty,
        id: Date.now().toString(),
        status: "PENDING",
      });
      onOpen(false);
    } catch (err: any) {
      toast(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPenalty({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    setFormData(getInitialValue());
  };

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Penalty
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add new penalty</DialogTitle>
          <DialogDescription>
            Create, customize, and assign a new penalty for specific rule violations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <Label className="px-0.5">Engineer Name</Label>
            <Input
              required
              type="text"
              value={formData.engineerName}
              placeholder="Enter engineer's name"
              onChange={(e) => setFormData({ ...formData, engineerName: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <Label className="px-0.5">Department</Label>
            <Select
              required
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value as Department })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a Department</SelectLabel>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label className="px-0.5">Reason</Label>
            <Input
              type="text"
              required
              value={formData.reason}
              placeholder="Enter a reason"
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <Label className="px-0.5">Amount (৳)</Label>
            <Input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              placeholder="Enter a amount"
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <Label className="px-0.5">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal")}>
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
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

                    setFormData({
                      ...formData,
                      date: value,
                    });
                  }}
                  selected={new Date(formData.date)}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-3">
            <Label className="px-0.5">Description</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button variant={"default"} type="submit" loading={loading}>
              Add Penalty
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
