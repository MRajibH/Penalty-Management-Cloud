import { Button } from "@/components/ui/button";
import useBoolean, { UseBooleanType } from "@/hooks/use-boolean";
import {
  SheetTitle,
  SheetContent,
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RoleForm from "./RoleForm";
import { ColumnDef } from "@tanstack/react-table";
import { roleType } from "@/context/data-context/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/data-table/DataTableRowActions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { roleRef } from "@/db/firebase.db";
import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleSchemaType } from "@/schema/RoleSchema";

export const CreateRole = () => {
  const { open, setOpen, onClose } = useBoolean();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"}>
          Add Role
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add Role</SheetTitle>
          <SheetDescription>Create a new role.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <RoleForm onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export const columns: ColumnDef<roleType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] ml-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "role_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role Name" />
    ),
  },
  {
    accessorKey: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader align="center" column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const EditBoolean = useBoolean();
      const DeleteBoolean = useBoolean();

      return (
        <div className="flex justify-center">
          <DataTableRowActions
            onClickEdit={EditBoolean.onOpen}
            onClickDelete={DeleteBoolean.onOpen}
          />
          <EditRole data={row.original} {...EditBoolean} />
          <DeleteRole data={row.original} {...DeleteBoolean} />
        </div>
      );
    },
  },
];

interface EditRoleProps extends UseBooleanType {
  data: roleType;
}

const EditRole = ({ data, ...boolean }: EditRoleProps) => {
  const { open, setOpen, onClose } = boolean;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit Employee</SheetTitle>
          <SheetDescription>Update the Employee data.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <RoleForm
          onClose={onClose}
          componentFor={"update"}
          defaultValue={data as unknown as RoleSchemaType & { id: string }}
        />
      </SheetContent>
    </Sheet>
  );
};

interface DeleteRoleProps extends UseBooleanType {
  data: roleType;
}

const DeleteRole = ({ data, ...boolean }: DeleteRoleProps) => {
  const { toast } = useToast();
  const { open, setOpen, onClose } = boolean;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const { id } = data;
    try {
      setLoading(true);
      await deleteDoc(doc(roleRef, id));
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] pb-4">
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription className="py-2">
            Are you sure you want to delete this Role?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant={"ghost"} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={"ghost"}
            loading={loading}
            onClick={handleClick}
            className="text-red-600 hover:text-red-600 hover:bg-red-50"
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
