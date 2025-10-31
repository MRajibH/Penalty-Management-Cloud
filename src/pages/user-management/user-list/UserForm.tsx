import { CreateDocument, UpdateDocument } from "@/common/helper";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ZSelectListType } from "@/components/z-forms/types";
import ZInput from "@/components/z-forms/ZInput";
import ZSelect from "@/components/z-forms/ZSelect";
import { useDataContext } from "@/context";
import { userRef } from "@/db/firebase.db";
import useForm from "@/hooks/use-form";
import { UserSchemaType, getUserSchema } from "@/schema/UserSchema";

interface UserFormProps {
  onClose: any;
  componentFor?: "update" | "create";
  defaultValue?: UserSchemaType & { id: string };
}

const UserForm = ({
  onClose,
  defaultValue,
  componentFor = "create",
}: UserFormProps) => {
  // -------------------------------------
  // Hooks
  // -------------------------------------
  const { designations } = useDataContext();
  const form = useForm<UserSchemaType>(getUserSchema(defaultValue));
  const loading = form.formState.isSubmitting;

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: UserSchemaType) => {
    // for creating
    if (componentFor === "create") {
      await CreateDocument({ ref: userRef, data });
    }

    // for updating
    else if (componentFor === "update" && defaultValue?.id) {
      const { id } = defaultValue;
      await UpdateDocument({ ref: userRef, docId: id, data });
    }

    onClose();
  };

  // -------------------------------------
  // Variables
  // -------------------------------------
  const options: ZSelectListType[] = designations.map(
    ({ id, designation_name }) => ({
      label: designation_name,
      value: id,
    })
  );

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
                return (
                  <ZSelect
                    form={form}
                    formKey="designation_id"
                    options={options}
                    {...props}
                  />
                );

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
    description:
      "Enter the employee's official email address, e.g., 'john.doe@example.com'.",
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
    description:
      "Select the designation this employee belongs to, e.g., 'Software Engineer'.",
    inputType: "select",
  },
];

export default UserForm;
