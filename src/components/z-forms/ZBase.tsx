import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DefaultZFormProps } from "./types";
import { ComponentProps } from "react";

interface ZBase extends DefaultZFormProps {
  control: Control<any>;
  inputProps?: ComponentProps<any>;
  children: React.ReactNode;
}

const ZBase = ({
  name,
  control,
  label,
  placeholder,
  description,
  inputProps,
  children,
}: ZBase) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{children}</FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZBase;
