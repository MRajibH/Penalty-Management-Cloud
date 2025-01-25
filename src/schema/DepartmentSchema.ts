import { z } from "zod";

// Define the schema
const schema = z.object({
  department_id: z.string(),
  department_name: z.string(),
});

// Default values for the form fields
const defaultValue = {
  department_id: "",
  department_name: "",
};

export type DepartmentSchemaType = z.infer<typeof schema>;

export const getDepartmentSchema = (values?: DepartmentSchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: values };
  else return { schema, defaultValue };
};
