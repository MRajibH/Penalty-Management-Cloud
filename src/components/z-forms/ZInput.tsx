import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DefaultZFormProps } from "./types";
import { ComponentProps } from "react";

interface ZInput extends DefaultZFormProps {
  control: Control<any>;
  inputProps?: ComponentProps<"input">;
}

const ZInput = ({ name, control, label, placeholder, description, inputProps }: ZInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...inputProps} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZInput;
