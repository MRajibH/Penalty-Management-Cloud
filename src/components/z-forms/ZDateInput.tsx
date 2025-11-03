import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DefaultZFormProps } from "./types";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

interface ZDateInput extends DefaultZFormProps {
  formKey: string;
  form: UseFormReturn<any>;
}

const ZDateInput = ({ form, formKey, ...formData }: ZDateInput) => {
  const [open, setOpen] = useState(false);
  const { name, label, placeholder, description } = formData;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                >
                  {field.value ? format(field.value, "PPP") : placeholder}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[335px] lg:w-[450px] p-0">
              <Calendar
                mode="single"
                onSelect={(date) => {
                  if (!date) return;
                  const year = date?.getFullYear();
                  const month = String((date?.getMonth() || 0) + 1).padStart(2, "0"); // Months are 0-indexed
                  const day = String(date?.getDate()).padStart(2, "0"); // Day of the month
                  const value = `${year}-${month}-${day}`;

                  form.setValue(formKey, value);
                }}
                selected={new Date(field.value)}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZDateInput;
