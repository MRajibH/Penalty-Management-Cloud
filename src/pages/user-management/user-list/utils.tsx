import { Button } from "@/components/ui/button";
import useBoolean from "@/hooks/use-boolean";
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
      <SheetContent className="lg:min-w-[500px]">
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
