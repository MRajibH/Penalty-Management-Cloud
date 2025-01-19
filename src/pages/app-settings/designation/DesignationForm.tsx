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
import { settingsCollectionRef } from "@/db/firebase.db";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDataContext } from "@/context/dataContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";

const DesignationSchema = z.object({
  department_name: z.string(),
  designation_name: z.string(),
});

type DesignationSchemaType = z.infer<typeof DesignationSchema>;

interface DesignationFormProps {
  onClose: any;
}

const DesignationForm = ({ onClose }: DesignationFormProps) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { appSettings } = useDataContext();
  const { departments } = appSettings;

  const form = useForm<DesignationSchemaType>({
    mode: "onChange",
    defaultValues: {},
    resolver: zodResolver(DesignationSchema),
  });

  const onSubmit = async (data: DesignationSchemaType) => {
    const docRef = doc(settingsCollectionRef, "app-settings");
    const document = await getDoc(docRef);

    if (!document.exists()) {
      await setDoc(docRef, {});
    }

    try {
      setLoading(true);
      const existing_data = document.data() || {};
      const designations = existing_data?.designations || [];

      const new_data = {
        id: uuid(),
        createdAt: new Date().getTime(),
        modifiedAt: new Date().getTime(),
        ...data,
      };

      updateDoc(docRef, {
        ...existing_data,
        designations: [...designations, new_data],
      });

      onClose();
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(err?.message || err, null, 2)}
            </code>
          </pre>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="py-4 space-y-4">
          {fields.map(
            ({ name, label, description, inputType, placeholder }) => {
              switch (inputType) {
                // ***
                // Input fields
                case "text":
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

                // ***
                // Select fields
                case "select":
                  return (
                    <FormField
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? departments.find(
                                        (department) =>
                                          department.department_name ===
                                          field.value
                                      )?.department_name
                                    : "Select department"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search department..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No framework found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {departments.map(
                                      ({ id, department_name }) => (
                                        <CommandItem
                                          key={id}
                                          value={department_name}
                                          onSelect={() => {
                                            form.setValue(
                                              "department_name",
                                              department_name
                                            );
                                            setOpen(false);
                                          }}
                                        >
                                          {department_name}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              department_name === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      )
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>{description}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
              }
            }
          )}
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
  inputType: "text" | "select";
  name: "department_name" | "designation_name";
};

const fields: fieldType[] = [
  {
    name: "designation_name",
    label: "Designation Name",
    description: "",
    inputType: "text",
    placeholder: "Enter a designation name ...",
  },
  {
    name: "department_name",
    label: "Department Name",
    description:
      "NB : If there is no department created, you need to create a department first.",
    inputType: "select",
    placeholder: "Enter a department name ...",
  },
];

export default DesignationForm;
