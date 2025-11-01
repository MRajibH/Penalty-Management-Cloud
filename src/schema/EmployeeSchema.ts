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
  avatar: z.string().min(1, { message: "Avatar is required." }),
});

// Default values for the form fields
const defaultValue = {
  name: "",
  email: "",
  phone: "",
  designation_id: "",
  avatar: "/avatar/user-1.jpg",
};

export type EmployeeSchemaType = z.infer<typeof schema>;

export const getEmployeeSchema = (values?: EmployeeSchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: values };
  else return { schema, defaultValue };
};
