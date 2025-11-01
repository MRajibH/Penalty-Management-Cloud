import { useDataContext } from "@/context";
import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreatePenaltyReason } from "./utils";

const PenaltyReasons = () => {
  const { penaltyReasons, userPermissions } = useDataContext();

  let elements = [<CreatePenaltyReason />];
  if (!userPermissions?.settings?.app_settings.includes("create")) {
    elements = [];
  }

  return <DataTable data={penaltyReasons} columns={columns} elements={elements} />;
};

export default PenaltyReasons;
