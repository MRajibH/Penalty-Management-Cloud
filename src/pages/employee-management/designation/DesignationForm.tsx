import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { designationRef } from "@/db/firebase.db";
import { useState } from "react";
import { useDataContext } from "@/context";
import ZInput from "@/components/z-forms/ZInput";
import ZSelect from "@/components/z-forms/ZSelect";
import { ZSelectListType } from "@/components/z-forms/types";
import { CreateDocument, UpdateDocument } from "@/common/helper";
import { getDesignationSchema, DesignationSchemaType } from "@/schema/DesignationSchema";
import useForm from "@/hooks/use-form";
import { Separator } from "@/components/ui/separator";

interface DesignationFormProps {
  onClose: any;
  componentFor?: "update" | "create" | "view";
  defaultValue?: DesignationSchemaType & { id: string };
}

const DesignationForm = ({
  onClose,
  defaultValue,
  componentFor = "create",
}: DesignationFormProps) => {
  // -------------------------------------
  // Hooks
  // -------------------------------------
  const { departments } = useDataContext();
  const form = useForm(getDesignationSchema(defaultValue));

  // -------------------------------------
  // States
  // -------------------------------------
  const [loading, setLoading] = useState(false);

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: DesignationSchemaType) => {
    try {
      setLoading(true);

      // for creating
      if (componentFor === "create") {
        await CreateDocument({
          ref: designationRef,
          data: { ...data, order: parseInt(data.order) },
        });
      }

      // for updating
      else if (componentFor === "update" && defaultValue?.id) {
        const { id } = defaultValue;
        await UpdateDocument({
          ref: designationRef,
          docId: id,
          data: { ...data, order: parseInt(data.order) },
        });
      }

      onClose();
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  // Variables
  // -------------------------------------
  const options: ZSelectListType[] = departments.map(({ id, department_name }) => ({
    label: department_name,
    value: id,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="py-4 space-y-6">
          {fields.map(({ inputType, ...props }) => {
            switch (inputType) {
              // ***
              // Input fields
              case "text":
                return (
                  <ZInput control={form.control} disabled={componentFor === "view"} {...props} />
                );

              // ***
              // Select fields
              case "select":
                return (
                  <ZSelect
                    form={form}
                    formKey="department_id"
                    options={options}
                    disabled={componentFor === "view"}
                    {...props}
                  />
                );
            }
          })}
        </div>

        {componentFor !== "view" && (
          <>
            <Separator />
            <DialogFooter className="gap-2 py-8">
              <Button type="reset" variant={"outline"} onClick={onClose}>
                Close
              </Button>
              <Button loading={loading} variant={"default"} type="submit">
                {componentFor === "update" ? "Update" : "Create"} Designation
              </Button>
            </DialogFooter>
          </>
        )}
      </form>
    </Form>
  );
};

type fieldType = {
  label: string;
  description: string;
  placeholder: string;
  inputType: "text" | "select";
  name: "department_id" | "designation_name" | "order";
};

const fields: fieldType[] = [
  {
    name: "designation_name",
    label: "Designation Name",
    description: "Enter the name of the new designation, e.g., 'Software Engineer'.",
    inputType: "text",
    placeholder: "Enter a designation name ...",
  },
  {
    name: "department_id",
    label: "Department Name",
    description: "Select the department this designation belongs to, e.g., 'DevSecOps'.",
    inputType: "select",
    placeholder: "Select a department name ...",
  },
  {
    name: "order",
    label: "Order",
    description: "Enter the order of the designation, e.g., '1'.",
    inputType: "text",
    placeholder: "Enter the order of the designation ...",
  },
];

export default DesignationForm;
