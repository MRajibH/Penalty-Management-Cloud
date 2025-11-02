import { CreateFirebaseUser, UpdateFirebaseUser } from "@/common/helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ZSelectListType } from "@/components/z-forms/types";
import ZBase from "@/components/z-forms/ZBase";
import ZInput from "@/components/z-forms/ZInput";
import ZSelect from "@/components/z-forms/ZSelect";
import { useAuthContext, useDataContext } from "@/context";
import useForm from "@/hooks/use-form";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UserSchemaType, getUserSchema } from "@/schema/UserSchema";
import { Check } from "lucide-react";

interface UserFormProps {
  onClose: any;
  componentFor?: "update" | "create" | "view";
  defaultValue?: UserSchemaType & { id: string; auth_id: string };
}

const UserForm = ({ onClose, defaultValue, componentFor = "create" }: UserFormProps) => {
  // -------------------------------------
  // Hooks
  // -------------------------------------
  const { toast } = useToast();
  const { roles } = useDataContext();
  const { currentUser } = useAuthContext();

  const form = useForm<UserSchemaType>(getUserSchema(defaultValue));
  const loading = form.formState.isSubmitting;

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: UserSchemaType) => {
    if (!currentUser) {
      toast({
        title: "Please login to continue",
        description: "You are not logged in",
      });
      return;
    }

    try {
      //--------------------------------------------------------------------------------------------
      /*
       ** Create User
       */
      //--------------------------------------------------------------------------------------------
      if (componentFor === "create") {
        await CreateFirebaseUser(currentUser.uid, data.email, data.password, data);
      }

      //--------------------------------------------------------------------------------------------
      /*
       ** Update User
       */
      //--------------------------------------------------------------------------------------------
      else if (componentFor === "update" && defaultValue?.id) {
        const { id, auth_id } = defaultValue;
        await UpdateFirebaseUser(auth_id, data.email, data.password, id, data);
      }

      //--------------------------------------------------------------------------------------------
      onClose();
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(error?.message || error, null, 2)}</code>
          </pre>
        ),
      });
    }
  };

  // -------------------------------------
  // Variables
  // -------------------------------------
  const selectedAvatar = form.watch("avatar");
  const options: ZSelectListType[] = roles.map(({ id, role_name }) => ({
    label: role_name,
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

              case "password":
                return (
                  <ZInput
                    control={form.control}
                    inputProps={{ type: "password" }}
                    disabled={componentFor === "view"}
                    {...props}
                  />
                );

              // ***
              // Select fields
              case "select":
                return (
                  <ZSelect
                    form={form}
                    formKey="role_id"
                    options={options}
                    disabled={componentFor === "view"}
                    {...props}
                  />
                );
            }
          })}
        </div>

        {componentFor !== "view" && (
          <>
            <Separator />
            <ZBase control={form.control} {...user_avatar_fields}>
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
            <DialogFooter className="gap-2 py-4">
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
  inputType: "text" | "select" | "file" | "password";
  name: "name" | "email" | "role_id" | "avatar" | "password";
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
    name: "password",
    label: "Password",
    inputType: "password",
    placeholder: "Password",
    description: "Enter the employee's password, e.g., '123456'.",
  },
  {
    name: "role_id",
    label: "Role",
    placeholder: "Select a Role",
    description: "Select the role this user belongs to, e.g., 'Admin'.",
    inputType: "select",
  },
];

const user_avatar_fields: fieldType = {
  name: "avatar",
  label: " Select Avatar",
  placeholder: "Avatar",
  description: "",
  inputType: "file",
};

export default UserForm;
