import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { DefaultZFormProps } from "./types";
import { ComponentProps } from "react";
import { Textarea } from "../ui/textarea";

interface ZTextarea extends DefaultZFormProps {
  control: Control<any>;
  inputProps?: ComponentProps<"textarea">;
}

const ZTextarea = ({ name, control, label, placeholder, description, inputProps }: ZTextarea) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...inputProps} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZTextarea;
