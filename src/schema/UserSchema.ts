import { z } from "zod";

// Define the schema
const schema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be greater then 3 characters." })
    .max(30, { message: "Name can not be longer than 30 characters." }),
  email: z.string().email("Must be a valid email address."),
  phone: z.string(),
  designation_id: z.string(),
});

// Default values for the form fields
const defaultValue = {
  name: "",
  email: "",
  phone: "",
  designation_id: "",
};

export type UserSchemaType = z.infer<typeof schema>;

export const getUserSchema = (values?: UserSchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: values };
  else return { schema, defaultValue };
};
