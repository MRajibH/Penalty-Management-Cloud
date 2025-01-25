import { z } from "zod";

const schema = z.object({
  department_id: z.string(),
  designation_name: z.string(),
});

const defaultValue = {
  department_id: "",
  designation_name: "",
};

export type DesignationSchemaType = z.infer<typeof schema>;

export const getDesignationSchema = (values?: DesignationSchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: values };
  else return { schema, defaultValue };
};
