import { z } from "zod";

// Define the schema
const schema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be greater then 3 characters." })
    .max(30, { message: "Name can not be longer than 30 characters." }),
  email: z
    .string()
    .trim()
    .email("Must be a valid email address.")
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be greater then 5 characters." }),
  role_id: z.string().min(1, { message: "Role is required." }),
  avatar: z.string().min(1, { message: "Avatar is required." }),
});

// Default values for the form fields
const defaultValue = {
  name: "",
  email: "",
  password: "",
  role_id: "",
  avatar: "/Penalty-Management-Cloud/avatar/user-1.jpg",
};

export type UserSchemaType = z.infer<typeof schema>;

export const getUserSchema = (values?: UserSchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: values };
  else return { schema, defaultValue };
};
