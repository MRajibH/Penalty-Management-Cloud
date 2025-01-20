import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { designationType, useDataContext } from "@/context/dataContext";
import { designationRef, employeeRef } from "@/db/firebase.db";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, doc, getDoc } from "firebase/firestore";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EmployeeFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be greater then 3 characters." })
    .max(30, { message: "Name can not be longer than 30 characters." }),
  email: z.string().email("Must be a valid email address."),
  designation_id: z.string(),
});

type EmployeeFormSchemaType = z.infer<typeof EmployeeFormSchema>;

interface EmployeeFormProps {
  onClose: any;
}

const EmployeeForm = ({ onClose }: EmployeeFormProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { designations } = useDataContext();

  const form = useForm<EmployeeFormSchemaType>({
    mode: "onChange",
    defaultValues: {},
    resolver: zodResolver(EmployeeFormSchema),
  });

  const onSubmit = async (data: EmployeeFormSchemaType) => {
    const { designation_id, ...rest_data } = data;
    try {
      setLoading(true);
      const docRef = doc(designationRef, designation_id);
      const designationSnapshot = await getDoc(docRef);
      const designationData = designationSnapshot.data() as designationType;
      const { department_name, designation_name } = designationData;

      const new_data = {
        department_name,
        designation_name,
        createdAt: new Date().getTime(),
        modifiedAt: new Date().getTime(),
        ...rest_data,
      };

      await addDoc(employeeRef, new_data);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(({ name, label, description, inputType }) => {
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
                        <Input
                          placeholder="Your full name here ..."
                          {...field}
                        />
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
                                ? designations.find(
                                    (designation) =>
                                      designation.id === field.value
                                  )?.designation_name
                                : "Select designation"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search designation..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No designation found.</CommandEmpty>
                              <CommandGroup>
                                {designations.map(
                                  ({ id, designation_name }) => (
                                    <CommandItem
                                      key={id}
                                      value={id}
                                      onSelect={() => {
                                        form.setValue("designation_id", id);
                                        setOpen(false);
                                      }}
                                    >
                                      {designation_name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          id === field.value
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
                      <FormDescription>
                        {designations.length === 0 ? description : ""}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );

            // ***
            // File fields
            // case "file":
            //   return (
            //     <FormField
            //       control={form.control}
            //       name={name}
            //       render={({ field }) => (
            //         <FormItem>
            //           <FormLabel>{label}</FormLabel>
            //           <FormControl>
            //             <Input
            //               type="file"
            //               placeholder="Your full name here ..."
            //               {...field}
            //             />
            //           </FormControl>
            //           <FormDescription>{description}</FormDescription>
            //           <FormMessage />
            //         </FormItem>
            //       )}
            //     />
            //   );
          }
        })}

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
  inputType: "text" | "select" | "file";
  name: "name" | "email" | "designation_id";
};

const fields: fieldType[] = [
  {
    name: "name",
    label: "Full Name",
    description: "",
    inputType: "text",
  },
  {
    name: "email",
    label: "Email",
    description: "",
    inputType: "text",
  },
  {
    name: "designation_id",
    label: "Designation",
    description:
      "NB : If there is no designation created, you need to create a designation first.",
    inputType: "select",
  },
];

export default EmployeeForm;
