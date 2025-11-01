import { Form } from "@/components/ui/form";
import useForm from "@/hooks/use-form";
import { PenaltyReasonSchemaType, getPenaltyReasonSchema } from "@/schema/PenaltyReasonSchema";
import ZInput from "@/components/z-forms/ZInput";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateDocument, UpdateDocument } from "@/common/helper";
import { penaltyReasonRef } from "@/db/firebase.db";

interface PenaltyReasonFormProps {
  onClose: () => void;
  componentFor?: "update" | "create" | "view";
  defaultValue?: PenaltyReasonSchemaType & { id: string };
}

const PenaltyReasonForm = ({
  onClose,
  defaultValue,
  componentFor = "create",
}: PenaltyReasonFormProps) => {
  // -------------------------------------
  // Hooks
  // -------------------------------------

  const form = useForm<PenaltyReasonSchemaType>(getPenaltyReasonSchema(defaultValue));
  const loading = form.formState.isSubmitting;

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: PenaltyReasonSchemaType) => {
    // for creating
    if (componentFor === "create") {
      await CreateDocument({ ref: penaltyReasonRef, data });
    }

    // for updating
    else if (componentFor === "update" && defaultValue?.id) {
      const { id } = defaultValue;
      await UpdateDocument({ ref: penaltyReasonRef, docId: id, data });
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="py-4 space-y-6">
          {fields.map(({ inputType, ...props }) => {
            return <ZInput control={form.control} disabled={componentFor === "view"} {...props} />;
          })}
        </div>

        {componentFor !== "view" && (
          <DialogFooter className="gap-2 py-8">
            <Button type="reset" variant={"outline"} onClick={onClose}>
              Close
            </Button>
            <Button loading={loading} variant={"default"} type="submit">
              {componentFor === "update" ? "Update" : "Create"} Penalty Reason
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
};

type fieldType = {
  name: string;
  label: string;
  description: string;
  inputType: "text";
  placeholder: string;
};

const fields: fieldType[] = [
  {
    name: "reason_name",
    label: "Reason Name",
    description: "Enter the name of the reason.",
    inputType: "text",
    placeholder: "Enter a reason ...",
  },
];

export default PenaltyReasonForm;
