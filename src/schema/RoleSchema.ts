import { z } from "zod";

// Define the schema
const schema = z.object({
  role_name: z.string().min(1, { message: "Role name is required." }),
  roles: z.object({
    overview: z.object({
      dashboard: z.array(z.string()),
      penalties: z.array(z.string()),
    }),
    management: z.object({
      users_management: z.array(z.string()),
      employee_management: z.array(z.string()),
      manage_constitution: z.array(z.string()),
    }),
    settings: z.object({
      app_logs: z.array(z.string()),
      app_settings: z.array(z.string()),
    }),
  }),
});

// Default values for the form fields
const defaultValue = {
  role_name: "",
  roles: {
    overview: {
      dashboard: ["view"],
      penalties: ["view"],
    },
    management: {
      users_management: ["view"],
      employee_management: ["view"],
      manage_constitution: ["view"],
    },
    settings: {
      app_logs: [],
      app_settings: [],
    },
  },
};

export type RoleSchemaType = z.infer<typeof schema>;

export const getRoleSchema = (values?: RoleSchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: values };
  else return { schema, defaultValue };
};
