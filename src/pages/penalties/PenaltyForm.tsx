import { useState } from "react";
import { Form } from "../../components/ui/form";
import { Button } from "../../components/ui/button";
import ZInput from "../../components/z-forms/ZInput";
import useForm from "@/hooks/use-form";
import ZSelect from "../../components/z-forms/ZSelect";
import { employeeRef, penaltyDataRef } from "@/db/firebase.db";
import { CreateDocument, UpdateDocument } from "@/common/helper";
import { getPenaltySchema, PenaltySchemaType } from "@/schema/PenaltySchema";
import { DialogFooter } from "../../components/ui/dialog";
import { ZSelectListType } from "../../components/z-forms/types";
import { useDataContext } from "@/context";
import ZDateInput from "@/components/z-forms/ZDateInput";
import ZTextarea from "@/components/z-forms/ZTextarea";

interface PenaltyFormProps {
  onClose: any;
  componentFor?: "update" | "create";
  defaultValue?: PenaltySchemaType & { id: string };
}

export function PenaltyForm({ onClose, defaultValue, componentFor = "create" }: PenaltyFormProps) {
  // -------------------------------------
  // Hooks
  // -------------------------------------
  const { employees, penaltyReasons } = useDataContext();
  const form = useForm<PenaltySchemaType>(getPenaltySchema(defaultValue));

  // -------------------------------------
  // States
  // -------------------------------------
  const [loading, setLoading] = useState(false);

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: PenaltySchemaType) => {
    try {
      setLoading(true);

      // for creating
      if (componentFor === "create") {
        await CreateDocument({ ref: penaltyDataRef, data: { ...data, status: "PENDING" } });
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
  const employeeOptions: ZSelectListType[] = employees.map(({ id, name, avatar }) => ({
    avatar,
    value: id,
    label: name,
  }));

  const reasonOptions: ZSelectListType[] = penaltyReasons.map(({ id, reason_name }) => ({
    value: id,
    label: reason_name,
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
                  <ZInput
                    key={props.name}
                    control={form.control}
                    inputProps={{ type: "text" }}
                    {...props}
                  />
                );

              // ***
              // Number fields
              case "number":
                return (
                  <ZInput
                    key={props.name}
                    control={form.control}
                    inputProps={{ type: "number" }}
                    {...props}
                  />
                );

              // ***
              // Select fields
              case "select":
                if (props.name === "employee_id") {
                  return (
                    <ZSelect
                      key={props.name}
                      form={form}
                      formKey={props.name}
                      options={employeeOptions}
                      {...props}
                    />
                  );
                } else if (props.name === "reason_id") {
                  return (
                    <ZSelect
                      key={props.name}
                      form={form}
                      formKey={props.name}
                      options={reasonOptions}
                      {...props}
                    />
                  );
                }
                return null;

              // ***
              // Date fields
              case "date":
                return <ZDateInput key={props.name} form={form} formKey="date" {...props} />;

              // ***
              // Input fields
              case "textarea":
                return <ZTextarea key={props.name} control={form.control} {...props} />;
            }
          })}
        </div>

        <DialogFooter className="gap-2 py-8">
          <Button type="reset" variant={"outline"} onClick={onClose}>
            Close
          </Button>
          <Button loading={loading} variant={"default"} type="submit">
            {componentFor === "update" ? "Update" : "Create"} Penalty
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

type fieldType = {
  label: string;
  description: string;
  placeholder: string;
  inputType: "text" | "select" | "number" | "date" | "textarea";
  name: "employee_id" | "reason_id" | "amount" | "date" | "description";
};

const fields: fieldType[] = [
  {
    name: "employee_id",
    label: "Engineer Name",
    description: "Select the engineer to assign the penalty to.",
    inputType: "select",
    placeholder: "Select Engineer ...",
  },
  {
    name: "reason_id",
    label: "Reason",
    description: "Select the reason for the penalty.",
    inputType: "select",
    placeholder: "Select a reason ...",
  },
  {
    name: "amount",
    label: "Amount (৳)",
    description: "Enter the amount of the penalty in Bangladeshi Taka.",
    inputType: "number",
    placeholder: "Enter amount ...",
  },
  {
    name: "date",
    label: "Date",
    description: "Select the date the penalty was assigned.",
    inputType: "date",
    placeholder: "Pick a date",
  },
  {
    name: "description",
    label: "Description",
    description: "Enter additional details about the penalty (optional).",
    inputType: "textarea",
    placeholder: "Enter description ...",
  },
];
