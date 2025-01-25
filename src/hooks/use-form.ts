import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useRHForm, UseFormReturn, FieldValues, DefaultValues } from "react-hook-form";

interface UseFormProps<T extends FieldValues> {
  defaultValue?: DefaultValues<T>;
  schema: z.ZodType<T>;
}

const useForm = <T extends FieldValues>({ schema, defaultValue }: UseFormProps<T>): UseFormReturn<T> => {
  const form = useRHForm<T>({
    mode: "onChange",
    defaultValues: defaultValue, // Ensures proper typing
    resolver: zodResolver(schema),
  });

  return form;
};

export default useForm;
