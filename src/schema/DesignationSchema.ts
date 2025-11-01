import { z } from "zod";

const schema = z.object({
  order: z.string().min(1, { message: "Order is required." }),
  department_id: z.string().min(1, { message: "Department is required." }),
  designation_name: z.string().min(1, { message: "Designation name is required." }),
});

const defaultValue = {
  order: "",
  department_id: "",
  designation_name: "",
};

export type DesignationSchemaType = z.infer<typeof schema>;

export const getDesignationSchema = (values?: DesignationSchemaType & { id: string }) => {
  if (values) return { schema, defaultValue: { ...values, order: values.order.toString() } };
  else return { schema, defaultValue };
};
