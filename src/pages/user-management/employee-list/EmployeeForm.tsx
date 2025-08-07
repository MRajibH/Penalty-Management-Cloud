import { CreateDocument, UpdateDocument } from "@/common/helper";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ZSelectListType } from "@/components/z-forms/types";
import ZInput from "@/components/z-forms/ZInput";
import ZSelect from "@/components/z-forms/ZSelect";
import { useDataContext } from "@/context";
import { employeeRef } from "@/db/firebase.db";
import useForm from "@/hooks/use-form";
import { EmployeeSchemaType, getEmployeeSchema } from "@/schema/EmployeeSchema";
import { useState } from "react";

interface EmployeeFormProps {
  onClose: any;
  componentFor?: "update" | "create";
  defaultValue?: EmployeeSchemaType & { id: string };
}

const EmployeeForm = ({ onClose, defaultValue, componentFor = "create" }: EmployeeFormProps) => {
  // -------------------------------------
  // Hooks
  // -------------------------------------
  const { designations } = useDataContext();
  const form = useForm<EmployeeSchemaType>(getEmployeeSchema(defaultValue));

  // -------------------------------------
  // States
  // -------------------------------------
  const [loading, setLoading] = useState(false);

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: EmployeeSchemaType) => {
    try {
      setLoading(true);

      // for creating
      if (componentFor === "create") {
        await CreateDocument({ ref: employeeRef, data });
      }

      // for updating
      else if (componentFor === "update" && defaultValue?.id) {
        const { id } = defaultValue;
        await UpdateDocument({ ref: employeeRef, docId: id, data });
      }

      onClose();
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  // Variables
  // -------------------------------------
  const options: ZSelectListType[] = designations.map(({ id, designation_name }) => ({
    label: designation_name,
    value: id,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="py-4 space-y-6">
          {fields.map(({ inputType, ...props }) => {
            switch (inputType) {
              // ***
              // Input fields
              case "text":
                return <ZInput control={form.control} {...props} />;

              // ***
              // Select fields
              case "select":
                return <ZSelect form={form} formKey="designation_id" options={options} {...props} />;

              // ***
              // File fields
              case "file":
                return <></>;
            }
          })}
        </div>

        <DialogFooter className="gap-2 py-8">
          <Button type="reset" variant={"outline"} onClick={onClose}>
            Close
          </Button>
          <Button loading={loading} variant={"default"} type="submit">
            {componentFor === "update" ? "Update" : "Create"} Employee
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

type fieldType = {
  label: string;
  description: string;
  placeholder: string;
  inputType: "text" | "select" | "file";
  name: "name" | "email" | "phone" | "designation_id";
};

const fields: fieldType[] = [
  {
    name: "name",
    inputType: "text",
    label: "Full Name",
    placeholder: "Name",
    description: "Enter the employee's full name, e.g., 'John Doe'.",
  },
  {
    name: "email",
    label: "Email",
    inputType: "text",
    placeholder: "john.doe@example.com",
    description: "Enter the employee's official email address, e.g., 'john.doe@example.com'.",
  },
  {
    name: "phone",
    label: "Phone",
    inputType: "text",
    placeholder: "Phone number",
    description: "Enter the employee's phone number, e.g., '01756160530'.",
  },
  {
    name: "designation_id",
    label: "Designation",
    placeholder: "Select a Designation",
    description: "Select the designation this employee belongs to, e.g., 'Software Engineer'.",
    inputType: "select",
  },
];

export default EmployeeForm;
