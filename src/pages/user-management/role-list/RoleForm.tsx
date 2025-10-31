import { CreateDocument, UpdateDocument } from "@/common/helper";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ZBase from "@/components/z-forms/ZBase";
import ZCheckbox from "@/components/z-forms/ZCheckbox";
import ZInput from "@/components/z-forms/ZInput";
import { roleRef } from "@/db/firebase.db";
import useForm from "@/hooks/use-form";
import { getRoleSchema, RoleSchemaType } from "@/schema/RoleSchema";

interface RoleFormProps {
  onClose: any;
  componentFor?: "update" | "create";
  defaultValue?: RoleSchemaType & { id: string };
}

type PermissionAction = "view" | "create" | "update" | "delete";

const RoleForm = ({
  onClose,
  defaultValue,
  componentFor = "create",
}: RoleFormProps) => {
  // -------------------------------------
  // Hooks
  // -------------------------------------
  const form = useForm<RoleSchemaType>(getRoleSchema(defaultValue));
  const loading = form.formState.isSubmitting;

  // -------------------------------------
  // Functions
  // -------------------------------------
  const onSubmit = async (data: RoleSchemaType) => {
    // for creating
    if (componentFor === "create") {
      await CreateDocument({ ref: roleRef, data });
    }

    // for updating
    else if (componentFor === "update" && defaultValue?.id) {
      const { id } = defaultValue;
      await UpdateDocument({ ref: roleRef, docId: id, data });
    }

    onClose();
  };

  // -------------------------------------
  // Variables
  // -------------------------------------
  const permissionSections = [
    {
      label: "Overview",
      key: "overview",
      children: [
        {
          label: "Dashboard",
          key: "dashboard",
          modules: ["View"],
        },
        {
          label: "Panalties",
          key: "penalties",
          modules: ["View", "Create", "Update", "Delete"],
        },
      ],
    },
    {
      label: "Management",
      key: "management",
      children: [
        {
          label: "Users Management",
          key: "users_management",
          modules: ["View", "Create", "Update", "Delete"],
        },
        {
          label: "Employee Management",
          key: "employee_management",
          modules: ["View", "Create", "Update", "Delete"],
        },
        {
          label: "Manage Constitution",
          key: "manage_constitution",
          modules: ["View", "Create", "Update", "Delete"],
        },
      ],
    },
    {
      label: "Settings",
      key: "settings",
      children: [
        {
          label: "App Logs",
          key: "app_logs",
          modules: ["View"],
        },
        {
          label: "App Settings",
          key: "app_settings",
          modules: ["View", "Create", "Update", "Delete"],
        },
      ],
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="py-4 space-y-6">
          <ZInput control={form.control} {...fields} />
        </div>

        <div>
          <ZBase control={form.control} {...roles_fields}>
            <div className="flex flex-col gap-4">
              <div className="flex text-xs font-medium">
                <div className="flex-[2] text-muted-foreground">Modules</div>
                {["View", "Create", "Update", "Delete"].map((label) => (
                  <div className="text-center flex-1 text-muted-foreground">
                    {label}
                  </div>
                ))}
              </div>

              <Separator />

              {permissionSections.map((section) => {
                const modules = section.children;

                return (
                  <div className="flex flex-col gap-4">
                    <div className="text-xs font-medium text-muted-foreground">
                      {section.label}
                    </div>

                    {modules.map((module) => (
                      <div
                        key={module.key}
                        className="flex text-xs font-medium"
                      >
                        <div className="flex-[2] pl-4">{module.label}</div>

                        {["View", "Create", "Update", "Delete"].map(
                          (action) => (
                            <div className="text-center flex-1">
                              {module.modules.includes(action) && (
                                <ZCheckbox
                                  control={form.control}
                                  action={action as PermissionAction}
                                  name={`roles.${section.key}.${module.key}`}
                                />
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}

              <Separator />
            </div>
          </ZBase>
        </div>

        <DialogFooter className="gap-2 py-8">
          <Button type="reset" variant={"outline"} onClick={onClose}>
            Close
          </Button>
          <Button loading={loading} variant={"default"} type="submit">
            {componentFor === "update" ? "Update" : "Create"} Role
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
  name: "roles" | "role_name";
};

const fields: fieldType = {
  name: "role_name",
  label: "Role Name",
  placeholder: "Role Name",
  description: "Enter the role name, e.g., 'Admin'.",
};

const roles_fields: fieldType = {
  name: "roles",
  label: "Roles",
  placeholder: "Roles",
  description:
    "Select the modules for the role. e.g., 'Overview, Management, Settings'.",
};

export default RoleForm;
