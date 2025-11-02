import { CreateDocument, UpdateDocument } from "@/common/helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ZSelectListType } from "@/components/z-forms/types";
import ZBase from "@/components/z-forms/ZBase";
import ZInput from "@/components/z-forms/ZInput";
import ZSelect from "@/components/z-forms/ZSelect";
import { useDataContext } from "@/context";
import { employeeRef } from "@/db/firebase.db";
import useForm from "@/hooks/use-form";
import { cn } from "@/lib/utils";
import { EmployeeSchemaType, getEmployeeSchema } from "@/schema/EmployeeSchema";
import { Check } from "lucide-react";

interface EmployeeFormProps {
  onClose: any;
  componentFor?: "update" | "create" | "view";
  defaultValue?: EmployeeSchemaType & { id: string };
}

const EmployeeForm = ({ onClose, defaultValue, componentFor = "create" }: EmployeeFormProps) => {
  // -------------------------------------
  // Hooks
  // -------------------------------------
  const { designations } = useDataContext();
  const form = useForm<EmployeeSchemaType>(getEmployeeSchema(defaultValue));
  const loading = form.formState.isSubmitting;

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: EmployeeSchemaType) => {
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
  };

  // -------------------------------------
  // Variables
  // -------------------------------------
  const selectedAvatar = form.watch("avatar");
  const options: ZSelectListType[] = designations.map(({ id, designation_name }) => ({
    label: designation_name,
    value: id,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="py-4 space-y-6">
          {componentFor === "view" && (
            <div className="flex justify-center pt-4">
              <Avatar className={cn("w-32 h-32 ")}>
                <AvatarImage src={selectedAvatar} />
                <AvatarFallback>{selectedAvatar.split("/").pop()?.split(".")[0]}</AvatarFallback>
              </Avatar>
            </div>
          )}

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
                    formKey="designation_id"
                    options={options}
                    disabled={componentFor === "view"}
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

        {componentFor !== "view" && (
          <>
            <Separator />
            <ZBase control={form.control} {...employee_avatar_fields}>
              <div className="grid grid-cols-5 gap-6 py-4">
                {Array.from({ length: 10 }).map((_, index) => {
                  const src = `/Penalty-Management-Cloud/avatar/user-${index + 1}.jpg`;
                  const isSelected = selectedAvatar === src;

                  return (
                    <div key={index} className="col-span-1 flex justify-center relative ">
                      <Avatar
                        className={cn(
                          "w-14 h-14 cursor-pointer transition-all duration-200",
                          isSelected && "brightness-50 scale-90 ",
                          !isSelected && "hover:brightness-75"
                        )}
                        onClick={() => form.setValue("avatar", src)}
                      >
                        <AvatarImage src={src} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {isSelected && (
                        <Check className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                      )}
                    </div>
                  );
                })}
              </div>
            </ZBase>
          </>
        )}

        {componentFor !== "view" && (
          <>
            <Separator />
            <DialogFooter className="gap-2 py-8">
              <Button type="reset" variant={"outline"} onClick={onClose}>
                Close
              </Button>
              <Button loading={loading} variant={"default"} type="submit">
                {componentFor === "update" ? "Update" : "Create"} Employee
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
  inputType: "text" | "select" | "file";
  name: "name" | "email" | "phone" | "designation_id" | "avatar";
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

const employee_avatar_fields: fieldType = {
  name: "avatar",
  label: " Select Avatar",
  placeholder: "Avatar",
  description: "",
  inputType: "file",
};

export default EmployeeForm;
