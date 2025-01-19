import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { settingsCollectionRef } from "@/db/firebase.db";

const DepartmentSchema = z.object({
  department_name: z.string(),
});

type DepartmentSchemaType = z.infer<typeof DepartmentSchema>;

interface DepartmentFormProps {
  onClose: any;
}

const DepartmentForm = ({ onClose }: DepartmentFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<DepartmentSchemaType>({
    mode: "onChange",
    defaultValues: {},
    resolver: zodResolver(DepartmentSchema),
  });

  const onSubmit = async (data: DepartmentSchemaType) => {
    const docRef = doc(settingsCollectionRef, "app-settings");
    const document = await getDoc(docRef);

    if (!document.exists()) {
      await setDoc(docRef, {});
    }

    try {
      setLoading(true);
      const existing_data = document.data() || {};
      const departments = existing_data?.departments || [];

      const new_data = {
        id: uuid(),
        createdAt: new Date().getTime(),
        modifiedAt: new Date().getTime(),
        ...data,
      };

      updateDoc(docRef, {
        ...existing_data,
        departments: [...departments, new_data],
      });

      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="py-4">
          {fields.map(({ name, label, description, placeholder }) => {
            return (
              <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>

        <DialogFooter className="gap-2">
          <Button type="reset" variant={"outline"} onClick={onClose}>
            Close
          </Button>
          <Button loading={loading} variant={"default"} type="submit">
            Create
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
  name: "department_name";
};

const fields: fieldType[] = [
  {
    name: "department_name",
    label: "Department Name",
    description: "",
    placeholder: "Enter a department name ...",
  },
];

export default DepartmentForm;
