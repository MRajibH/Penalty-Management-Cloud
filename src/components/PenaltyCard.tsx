import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ProcessedPenaltyDataType } from "@/context/data-context/types";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { useDataContext } from "@/context";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { SearchFilters } from "@/types";
import { useToast } from "@/hooks/use-toast";
import useBoolean from "@/hooks/use-boolean";
import { Fragment, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { doc, updateDoc } from "firebase/firestore";
import { penaltyDataRef } from "@/db/firebase.db";

interface PenaltyCardProps {
  filters: SearchFilters;
  penalty: ProcessedPenaltyDataType;
}

export const BDT = ({ className = "" }) => (
  <svg className={cn("", className)} xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M18.09 10.5V9h-8.5V4.5A1.5 1.5 0 0 0 8.09 3a1.5 1.5 0 0 0-1.5 1.5A1.5 1.5 0 0 0 8.09 6v3h-3v1.5h3v6.2c0 2.36 1.91 4.27 4.25 4.3c2.34-.04 4.2-1.96 4.16-4.3c0-1.59-.75-3.09-2-4.08a4.08 4.08 0 0 0-.7-.47c-.22-.1-.46-.15-.7-.15c-.71 0-1.36.39-1.71 1c-.19.3-.29.65-.29 1c.01 1.1.9 2 2.01 2c.62 0 1.2-.31 1.58-.8c.21.47.31.98.31 1.5c.04 1.5-1.14 2.75-2.66 2.8c-1.53 0-2.76-1.27-2.75-2.8v-6.2h8.5Z"
    />
  </svg>
);

export function PenaltyCard({ penalty, filters }: PenaltyCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { userPermissions } = useDataContext();
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: "markAllAsPaid" | "disputeAllPenalty" | null;
  }>({
    open: false,
    type: null,
  });

  // Handle open and close dialogs
  const canUpdatePenalty = userPermissions?.management?.employee_management.includes("update");
  const penalties = penalty.penalties;

  const totalPendingAmount = penalties.reduce((acc, penalty) => {
    const amount = penalty.status === "PENDING" ? penalty.amount : 0;
    return acc + Number(amount);
  }, 0);

  const totalPaidAmount = penalties.reduce((acc, penalty) => {
    const amount = penalty.status === "PAID" ? penalty.amount : 0;
    return acc + Number(amount);
  }, 0);

  const showTotalPaidAmount = filters.status === "ALL" || filters.status === "PAID";
  const showTotalPendingAmount = filters.status === "ALL" || filters.status === "PENDING";

  const handleClick = async (status: "DISPUTED" | "PAID") => {
    try {
      setLoading(true);

      const promises = penalties
        .filter((penalty) => penalty.status === "PENDING")
        .map(async (penalty) => {
          return updateDoc(doc(penaltyDataRef, penalty.id), {
            status,
          });
        });

      await Promise.all(promises);
      setDialogState({ open: false, type: null });
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={penalty.employee.avatar} />
                <AvatarFallback>{penalty.employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="px-1 font-medium">{penalty.employee.name}</div>
                <Badge variant="outline" className="w-max">{penalty.designation.designation_name}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="px-3 space-x-2 h-10">
          {showTotalPendingAmount && <Badge variant="outline">Pending : BDT {totalPendingAmount}</Badge>}
          {showTotalPaidAmount && <Badge variant="outline">Paid : {totalPaidAmount}</Badge>}
        </div>

        <Separator />
        <PenaltyList penalties={penalties} />
        {canUpdatePenalty && (
          <>
            <Separator className="mb-6" />
            <CardFooter className="gap-4">
              <>
                <Button
                  variant={"outline"}
                  className="w-full"
                  onClick={() => setDialogState({ open: true, type: "disputeAllPenalty" })}
                >
                  Dispute all
                </Button>
                <Button className="w-full" onClick={() => setDialogState({ open: true, type: "markAllAsPaid" })}>
                  Mark all as Paid
                </Button>
              </>
            </CardFooter>
          </>
        )}
      </Card>

      <Dialog open={dialogState.open} onOpenChange={(open) => setDialogState({ ...dialogState, open })}>
        <DialogContent className="sm:max-w-[425px] pb-4">
          <DialogHeader>
            <DialogTitle>Update Penalty Status</DialogTitle>
            <DialogDescription className="py-2">
              Are you sure you want to{" "}
              {dialogState.type === "markAllAsPaid" ? "mark all as paid" : "dispute all penalty"}?
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <DialogFooter className="gap-2">
            <Button variant={"outline"} onClick={() => setDialogState({ ...dialogState, open: false })}>
              Cancel
            </Button>
            <Button
              loading={loading}
              onClick={() => handleClick(dialogState.type === "markAllAsPaid" ? "PAID" : "DISPUTED")}
            >
              {dialogState.type === "markAllAsPaid" ? "Mark all as Paid" : "Dispute all"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const PenaltyList = ({ penalties }: { penalties: ProcessedPenaltyDataType["penalties"] }) => {
  const { toast } = useToast();
  const { userPermissions } = useDataContext();
  const [loading, setLoading] = useState(false);
  const { open, setOpen, onOpen, onClose } = useBoolean();
  const [selectedPenalty, setSelectedPenalty] = useState<ProcessedPenaltyDataType["penalties"][0] | null>(null);

  const canUpdatePenalty = userPermissions?.overview?.penalties?.includes("update");

  const handleClick = async (status: "DISPUTED" | "PAID") => {
    try {
      setLoading(true);
      await updateDoc(doc(penaltyDataRef, selectedPenalty?.id), {
        status,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePenaltyClick = (penalty: ProcessedPenaltyDataType["penalties"][0]) => {
    setSelectedPenalty(penalty);
    onOpen();
  };

  return (
    <div className="py-4 space-y-2 h-56 overflow-y-auto">
      {penalties.map((penalty, index) => {
        const date = new Date(penalty.date);
        const formattedDate = date
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          })
          .replace(" ", ", ");

        const isPaid = penalty.status === "PAID";
        const isDisputed = penalty.status === "DISPUTED";
        const paidBadgeColor = "border-emerald-500 text-emerald-800 bg-emerald-50";
        const disputedBadgeColor = "border-red-500 text-red-800 bg-red-50";

        return (
          <Fragment key={index}>
            {index > 0 && <div className="border-dashed border-b border-gray-200" />}
            <div key={index} className="px-4 flex gap-0 items-center text-gray-800 text-[13px] font-medium">
              <span className="w-6 text-gray-500 font-normal">#{index+1}</span>
              <span className="w-14">{formattedDate}</span>
              <span className="w-3">:</span>

              {penalty.status === "PENDING" && canUpdatePenalty ? (
                <span
                  className="flex-1 text-gray-600 hover:underline cursor-pointer hover:text-primary"
                  onClick={() => handlePenaltyClick(penalty)}
                >
                  {penalty.reason.reason_name}
                </span>
              ) : (
                <span className="flex-1 text-gray-600">{penalty.reason.reason_name}</span>
              )}


              <div className="w-20 flex justify-end">
                <Badge variant="outline" className={cn(isPaid ? paidBadgeColor : isDisputed ? disputedBadgeColor : "", "")}>
                  BDT {penalty.amount}
                </Badge>
              </div>

            </div>
          </Fragment>
        );
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] pb-4">
          <DialogHeader>
            <DialogTitle>Update Penalty Status</DialogTitle>
            <DialogDescription className="py-2">
              Click following options to update the penalty status.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="space-y-4">
            {/* Penalty info */}
            <div className="flex flex-col gap-2 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span>Date: {new Date(selectedPenalty?.date || "").toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Amount: BDT {selectedPenalty?.amount}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Reason: {selectedPenalty?.reason.reason_name}</span>
              </div>

              {selectedPenalty?.description && (
                <div className="flex items-center gap-2">
                  <span>Description: {selectedPenalty?.description}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <DialogFooter className="gap-2">
            <Button
              variant={"outline"}
              className="text-red-600 hover:text-red-600 hover:bg-red-50 border-red-500"
              loading={loading}
              onClick={() => handleClick("DISPUTED")}
            >
              Dispute
            </Button>
            <Button type="submit" loading={loading} onClick={() => handleClick("PAID")}>
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
