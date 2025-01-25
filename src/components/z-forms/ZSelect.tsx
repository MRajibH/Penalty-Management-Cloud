import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import { DefaultZFormProps, ZSelectListType } from "./types";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface ZSelect extends DefaultZFormProps {
  formKey: string;
  form: UseFormReturn<any>;
  options: ZSelectListType[];
}

const ZSelect = ({ form, formKey, options, ...formData }: ZSelect) => {
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
                  {field.value ? options.find((option) => option.value === field.value)?.label : placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[335px] lg:w-[450px] p-0">
              <Command>
                <CommandInput placeholder="Search department..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No department found.</CommandEmpty>
                  <CommandGroup>
                    {options.map(({ label, value }) => (
                      <CommandItem
                        key={value}
                        value={label}
                        onSelect={() => {
                          form.setValue(formKey, value);
                          setOpen(false);
                        }}
                      >
                        {label}
                        <Check className={cn("ml-auto", value === field.value ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            {options.length === 0
              ? "NB : If there is no department created, you need to create a department first."
              : description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZSelect;
