import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import useBoolean, { UseBooleanType } from "@/hooks/use-boolean";
import { Separator } from "@/components/ui/separator";
import PenaltyReasonForm from "./PenaltyReasonForm";
import { PenaltyReasonSchemaType } from "@/schema/PenaltyReasonSchema";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataContext } from "@/context";
import { DataTableRowActions } from "@/components/data-table/DataTableRowActions";
import { useToast } from "@/hooks/use-toast";
import { deleteDoc, doc } from "firebase/firestore";
import { penaltyReasonRef } from "@/db/firebase.db";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog";
import { useState } from "react";

export const CreatePenaltyReason = () => {
  const { open, setOpen, onClose } = useBoolean();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"}>
          Add Penalty Reason
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:min-w-[500px] overflow-auto">
        <SheetHeader>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>Create a new user.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <PenaltyReasonForm onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export const columns: ColumnDef<PenaltyReasonSchemaType & { id: string }>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "reason_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reason Name" />,
    cell: ({ row }) => <div className="w-full">{row.getValue("reason_name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader align="center" column={column} title="Action" />,
    cell: ({ row }) => {
      const EditBoolean = useBoolean();
      const DeleteBoolean = useBoolean();
      const { userPermissions } = useDataContext();

      const canUpdate = userPermissions?.settings?.app_settings.includes("update");
      const canDelete = userPermissions?.settings?.app_settings.includes("delete");

      return (
        <div className="flex justify-center w-[120px] mx-auto">
          <DataTableRowActions
            onClickEdit={canUpdate ? EditBoolean.onOpen : undefined}
            onClickDelete={canDelete ? DeleteBoolean.onOpen : undefined}
          />
          <EditPenaltyReason data={row.original} {...EditBoolean} />
          <DeletePenaltyReason data={row.original} {...DeleteBoolean} />
        </div>
      );
    },
  },
];

interface EditPenaltyReasonProps extends UseBooleanType {
  data: PenaltyReasonSchemaType & { id: string };
}

const EditPenaltyReason = ({ data, ...boolean }: EditPenaltyReasonProps) => {
  const { open, setOpen, onClose } = boolean;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit Employee</SheetTitle>
          <SheetDescription>Update the Employee data.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <PenaltyReasonForm
          onClose={onClose}
          componentFor={"update"}
          defaultValue={data as unknown as PenaltyReasonSchemaType & { id: string }}
        />
      </SheetContent>
    </Sheet>
  );
};

interface DeletePenaltyReasonProps extends UseBooleanType {
  data: PenaltyReasonSchemaType & { id: string };
}

const DeletePenaltyReason = ({ data, ...boolean }: DeletePenaltyReasonProps) => {
  const { toast } = useToast();
  const { open, setOpen, onClose } = boolean;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const { id } = data;
    try {
      setLoading(true);
      await deleteDoc(doc(penaltyReasonRef, id));
      onClose();
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(err?.message || err, null, 2)}</code>
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
            Are you sure you want to delete this Penalty Reason?
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
