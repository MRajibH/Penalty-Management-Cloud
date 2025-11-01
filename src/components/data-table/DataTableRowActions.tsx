import { Edit3, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Fragment, MouseEventHandler } from "react";

interface DataTableRowActionsProps {
  disabledEdit?: boolean;
  disabledDelete?: boolean;

  onClickView?: MouseEventHandler<HTMLDivElement>;
  onClickEdit?: MouseEventHandler<HTMLDivElement>;
  onClickDelete?: MouseEventHandler<HTMLDivElement>;
}

export function DataTableRowActions({
  onClickView,
  onClickEdit,
  onClickDelete,
  disabledEdit,
  disabledDelete,
}: DataTableRowActionsProps) {
  const renderView = (
    <DropdownMenuItem onClick={onClickView}>
      <Eye />
      View
    </DropdownMenuItem>
  );

  const renderEdit = (
    <DropdownMenuItem onClick={onClickEdit} disabled={disabledEdit}>
      <Edit3 />
      Edit
    </DropdownMenuItem>
  );

  const renderDelete = (
    <DropdownMenuItem
      onClick={onClickDelete}
      className="text-red-600 focus:bg-red-50 focus:text-red-600"
      disabled={disabledDelete}
    >
      <Trash2 />
      Delete
    </DropdownMenuItem>
  );

  const renderChildrens = [];
  onClickView && renderChildrens.push(renderView);
  onClickEdit && renderChildrens.push(renderEdit);
  onClickDelete && renderChildrens.push(renderDelete);

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
          {renderChildrens.map((child, index) => (
            <Fragment key={index}>
              {index > 0 && <DropdownMenuSeparator />}
              {child}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
