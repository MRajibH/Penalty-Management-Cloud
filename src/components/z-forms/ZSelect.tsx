import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { DefaultZFormProps, ZSelectListType } from "./types";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ZSelect extends DefaultZFormProps {
  formKey: string;
  form: UseFormReturn<any>;
  options: ZSelectListType[];
  disabled?: boolean;
}

const ZSelect = ({ form, formKey, options, disabled, ...formData }: ZSelect) => {
  const [open, setOpen] = useState(false);
  const { name, label, placeholder, description } = formData;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                  disabled={disabled}
                >
                  {field.value
                    ? options.find((option) => option.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[335px] lg:w-[450px] p-0">
              <Command>
                <CommandInput placeholder={`Search ${label}...`} className="h-9" />
                <CommandList>
                  <CommandEmpty>No {label} found.</CommandEmpty>
                  <CommandGroup>
                    {options.map(({ label, value, avatar }) => (
                      <CommandItem
                        key={value}
                        value={label}
                        onSelect={() => {
                          form.setValue(formKey, value);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {avatar && (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={avatar} />
                              <AvatarFallback>
                                {avatar.split("/").pop()?.split(".")[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span className="font-medium">{label}</span>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto",
                            value === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            {options.length === 0
              ? `NB : If there is no ${label} created, you need to create a ${label} first.`
              : description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZSelect;
