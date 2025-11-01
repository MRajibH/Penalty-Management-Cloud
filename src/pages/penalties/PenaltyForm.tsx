import { useState } from "react";
import { Form } from "../../components/ui/form";
import { Button } from "../../components/ui/button";
import ZInput from "../../components/z-forms/ZInput";
import useForm from "@/hooks/use-form";
import ZSelect from "../../components/z-forms/ZSelect";
import { employeeRef } from "@/db/firebase.db";
import { UpdateDocument } from "@/common/helper";
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
  const { employees } = useDataContext();
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
        console.log(data);
        // await CreateDocument({ ref: employeeRef, data });
      }

      // for updating
      else if (componentFor === "update" && defaultValue?.id) {
        const { id } = defaultValue;
        await UpdateDocument({ ref: employeeRef, docId: id, data });
      }

      // onClose();
    } finally {
      setLoading(false);
    }
  };

  // const addPenalty = async (newPenalty: Omit<Penalty, "id" | "status">) => {
  //   try {
  //     setLoading(true);
  //     await addDoc(penaltyCollectionRef, {
  //       ...newPenalty,
  //       id: Date.now().toString(),
  //       status: "PENDING",
  //     });
  //     onOpen(false);
  //   } catch (err: any) {
  //     toast(err?.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   addPenalty({
  //     ...formData,
  //     amount: parseFloat(formData.amount),
  //   });
  //   setFormData(getInitialValue());
  // };

  // -------------------------------------
  // Variables
  // -------------------------------------
  const options: ZSelectListType[] = employees.map(({ id, name }) => ({ label: name, value: id }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="py-4 space-y-6">
          {fields.map(({ inputType, ...props }) => {
            switch (inputType) {
              // ***
              // Input fields
              case "text":
                return <ZInput control={form.control} inputProps={{ type: "text" }} {...props} />;

              // ***
              // Number fields
              case "number":
                return <ZInput control={form.control} inputProps={{ type: "number" }} {...props} />;

              // ***
              // Select fields
              case "select":
                return <ZSelect form={form} formKey="employee_id" options={options} {...props} />;

              // ***
              // Date fields
              case "date":
                return <ZDateInput form={form} formKey="date" {...props} />;

              // ***
              // Input fields
              case "textarea":
                return <ZTextarea control={form.control} {...props} />;
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
  name: "employee_id" | "reason" | "amount" | "date" | "description";
};

const fields: fieldType[] = [
  {
    name: "employee_id",
    label: "Engineer Name",
    description: "Enter the name of the engineer to assign the penalty to.",
    inputType: "select",
    placeholder: "Enter engineer's name ...",
  },
  {
    name: "reason",
    label: "Reason",
    description: "Enter the reason for the penalty.",
    inputType: "text",
    placeholder: "Enter a reason ...",
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
