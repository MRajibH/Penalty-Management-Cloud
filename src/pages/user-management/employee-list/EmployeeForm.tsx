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
import { useForm } from "react-hook-form";
import { z } from "zod";

const EmployeeFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be greater then 3 characters." })
    .max(30, { message: "Name can not be longer than 30 characters." }),
  email: z.string().email("Must be a valid email address."),
  designation: z
    .string()
    .min(4, { message: "Designation must be greater then 8 characters." })
    .max(30, { message: "Designation can not be longer than 30 characters." }),
  team: z
    .string()
    .min(4, { message: "Designation must be greater then 8 characters." })
    .max(30, { message: "Designation can not be longer than 30 characters." }),
});

type EmployeeFormSchemaType = z.infer<typeof EmployeeFormSchema>;

const EmployeeForm = () => {
  const { toast } = useToast();

  const form = useForm<EmployeeFormSchemaType>({
    mode: "onChange",
    defaultValues: {},
    resolver: zodResolver(EmployeeFormSchema),
  });

  function onSubmit(data: EmployeeFormSchemaType) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

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
              return <>select</>;

            // ***
            // File fields
            case "file":
              return (
                <FormField
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
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
          }
        })}

        <DialogFooter className="gap-2">
          <Button
            type="reset"
            variant={"outline"}
            onClick={() => {
              onOpen(false);
            }}
          >
            Close
          </Button>
          <Button variant={"default"} type="submit">
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
  name: "name" | "email" | "designation" | "team";
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
    name: "designation",
    label: "Designation",
    description: "",
    inputType: "select",
  },
  {
    name: "team",
    label: "Team",
    description: "",
    inputType: "select",
  },
  {
    name: "avater",
    label: "User Photo",
    description: "",
    inputType: "file",
  },
];

export default EmployeeForm;
