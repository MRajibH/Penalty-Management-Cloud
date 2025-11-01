import { z } from "zod";

// Define the schema
const schema = z.object({
  reason_name: z.string().min(1, { message: "Reason name is required." }),
});

// Default values for the form fields
const defaultValue = {
  reason_name: "",
};

export type PenaltyReasonSchemaType = z.infer<typeof schema>;

export const getPenaltyReasonSchema = (values?: PenaltyReasonSchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: values };
  else return { schema, defaultValue };
};
