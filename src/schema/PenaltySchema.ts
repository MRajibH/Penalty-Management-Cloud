import { z } from "zod";

// Define the schema
const schema = z.object({
  employee_id: z.string().min(1, "Engineer name required."),
  reason_id: z.string().min(1, "Reason is required."),
  amount: z.string().min(1, "Amount must be a positive number."),
  date: z.string().min(1, "Date is required."),
  description: z.string().optional(),
});

// Default values for the form fields
const defaultValue = {
  employee_id: "",
  reason_id: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
};

export type PenaltySchemaType = z.infer<typeof schema>;

export const getPenaltySchema = (values?: PenaltySchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: values };
  else return { schema, defaultValue };
};
