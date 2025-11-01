import { useDataContext } from "@/context";
import { DataTable } from "@/components/data-table/DataTable";
import { columns as defaultColumns, CreateDesignation } from "./utils";

const Designation = () => {
  const { designations, userPermissions } = useDataContext();

  let columns = defaultColumns;
  let elements = [<CreateDesignation />];
  if (!userPermissions?.management?.employee_management.includes("create")) {
    elements = [];
  }

  return <DataTable columns={columns} data={designations} elements={elements} />;
};

export default Designation;
