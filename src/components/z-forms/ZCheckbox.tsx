import { FormField } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Control } from "react-hook-form";

interface ZCheckbox {
  name: string;
  disabled?: boolean;
  control: Control<any>;
  action?: "view" | "create" | "update" | "delete";
}

const ZCheckbox = ({ name, control, action, disabled }: ZCheckbox) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // if action is provided, return the value of the checkbox
        const value = action ? field.value.includes(action.toLowerCase()) : field.value;

        const handleChange = (e: any) => {
          if (action) {
            const newValues = [...field.value];
            if (newValues.includes(action.toLowerCase())) {
              newValues.splice(newValues.indexOf(action.toLowerCase()), 1);
            } else {
              newValues.push(action.toLowerCase());
            }
            field.onChange(newValues);
          } else {
            field.onChange(e);
          }
        };

        return (
          <Checkbox {...field} checked={value} onCheckedChange={handleChange} disabled={disabled} />
        );
      }}
    />
  );
};

export default ZCheckbox;
