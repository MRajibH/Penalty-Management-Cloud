import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MouseEventHandler } from "react";

interface DataTableRowActionsProps {
  disabledEdit?: boolean;
  disabledDelete?: boolean;
  onClickEdit?: MouseEventHandler<HTMLDivElement>;
  onClickDelete?: MouseEventHandler<HTMLDivElement>;
}

export function DataTableRowActions({
  onClickEdit,
  onClickDelete,
  disabledEdit,
  disabledDelete,
}: DataTableRowActionsProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={onClickEdit} disabled={disabledEdit}>
            <Edit3 />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onClickDelete}
            className="text-red-600 focus:bg-red-50 focus:text-red-600"
            disabled={disabledDelete}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
