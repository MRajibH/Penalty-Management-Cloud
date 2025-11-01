import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useBoolean from "@/hooks/use-boolean";
import { Plus } from "lucide-react";
import { PenaltyForm } from "./PenaltyForm";

export const CreatePenalty = () => {
  const { open, setOpen, onClose } = useBoolean(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"}>
          Add Penalty
          <Plus />
        </Button>
      </SheetTrigger>

      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add Penalty</SheetTitle>
          <SheetDescription>Create a new Penalty.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <PenaltyForm onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};
