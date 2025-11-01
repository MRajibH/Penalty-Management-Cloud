import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { departmentRef } from "@/db/firebase.db";
import { getDepartmentSchema, DepartmentSchemaType } from "@/schema/DepartmentSchema";
import useForm from "@/hooks/use-form";
import { CreateDocument, UpdateDocument } from "@/common/helper";
import ZInput from "@/components/z-forms/ZInput";
import { Separator } from "@/components/ui/separator";

interface DepartmentFormProps {
  onClose: any;
  componentFor?: "update" | "create" | "view";
  defaultValue?: DepartmentSchemaType & { id: string };
}

const DepartmentForm = ({
  onClose,
  defaultValue,
  componentFor = "create",
}: DepartmentFormProps) => {
  // -------------------------------------
  // Hooks
  // -------------------------------------
  const form = useForm<DepartmentSchemaType>(getDepartmentSchema(defaultValue));

  // -------------------------------------
  // States
  // -------------------------------------
  const [loading, setLoading] = useState(false);

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: DepartmentSchemaType) => {
    try {
      setLoading(true);

      // for creating
      if (componentFor === "create") {
        await CreateDocument({ ref: departmentRef, data });
      }

      // for updating
      else if (componentFor === "update" && defaultValue?.id) {
        const { id } = defaultValue;
        await UpdateDocument({ ref: departmentRef, docId: id, data });
      }

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="py-4 space-y-6">
          {fields.map((props) => {
            return <ZInput control={form.control} disabled={componentFor === "view"} {...props} />;
          })}
        </div>

        {componentFor !== "view" && (
          <>
            <Separator />
            <DialogFooter className="gap-2 py-8">
              <Button type="reset" variant={"outline"}>
                Close
              </Button>
              <Button loading={loading} variant={"default"} type="submit">
                {componentFor === "update" ? "Update" : "Create"} Department
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
  name: "department_name";
};

const fields: fieldType[] = [
  {
    name: "department_name",
    label: "Department Name",
    description: "Enter the name of the new department, e.g., 'DevSecOps'.",
    placeholder: "Enter a department name ...",
  },
];

export default DepartmentForm;
