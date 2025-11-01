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
import UserForm from "./UserForm";
import { ColumnDef } from "@tanstack/react-table";
import { UserSchemaType } from "@/schema/UserSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext, useDataContext } from "@/context";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "@/components/data-table/DataTableRowActions";
import { useToast } from "@/hooks/use-toast";
import { deleteDoc, doc } from "firebase/firestore";
import { userRef } from "@/db/firebase.db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DeleteFirebaseUser } from "@/common/helper";

export const CreateUser = () => {
  const { open, setOpen, onClose } = useBoolean();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"}>
          Add User
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:min-w-[500px] overflow-auto">
        <SheetHeader>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>Create a new user.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <UserForm onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export const columns: ColumnDef<UserSchemaType & { id: string; auth_id: string }>[] = [
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
    accessorKey: "avatar",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Avatar" />,
    cell: ({ row }) => {
      const avatar: string = row.getValue("avatar") || "";
      return (
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatar} />
          <AvatarFallback>{avatar.split("/").pop()?.split(".")[0]}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return (
        <a href={`mailto:${row.getValue("email")}`} className="hover:underline hover:text-blue-700">
          {row.getValue("email")}
        </a>
      );
    },
  },
  {
    accessorKey: "role_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const { roleMapped } = useDataContext();

      const id: string = row.getValue("role_id");
      const role_name = roleMapped[id]?.role_name;
      return <Badge variant="outline">{role_name}</Badge>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader align="center" column={column} title="Action" />,
    cell: ({ row }) => {
      const EditBoolean = useBoolean();
      const DeleteBoolean = useBoolean();
      const { currentUser } = useAuthContext();

      const isMySelf = row.original.auth_id === currentUser?.uid;
      // const isAdmin = currentUser?.role === "admin";

      return (
        <div className="flex justify-center">
          <DataTableRowActions
            disabledDelete={isMySelf}
            onClickEdit={EditBoolean.onOpen}
            onClickDelete={DeleteBoolean.onOpen}
          />
          <EditUser data={row.original} {...EditBoolean} />
          <DeleteUser data={row.original} {...DeleteBoolean} />
        </div>
      );
    },
  },
];

interface EditUserProps extends UseBooleanType {
  data: UserSchemaType & { id: string };
}

const EditUser = ({ data, ...boolean }: EditUserProps) => {
  const { open, setOpen, onClose } = boolean;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit Employee</SheetTitle>
          <SheetDescription>Update the Employee data.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <UserForm
          onClose={onClose}
          componentFor={"update"}
          defaultValue={data as unknown as UserSchemaType & { id: string }}
        />
      </SheetContent>
    </Sheet>
  );
};

interface DeleteUserProps extends UseBooleanType {
  data: UserSchemaType & { id: string; auth_id: string };
}

const DeleteUser = ({ data, ...boolean }: DeleteUserProps) => {
  const { toast } = useToast();
  const { open, setOpen, onClose } = boolean;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const { id } = data;
    try {
      setLoading(true);
      // delete firebase user
      await DeleteFirebaseUser(data.auth_id);

      // delete user from database
      await deleteDoc(doc(userRef, id));
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
          <DialogTitle>Delete User Confirmation</DialogTitle>
          <DialogDescription className="py-2">
            Are you sure you want to delete this User?
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
