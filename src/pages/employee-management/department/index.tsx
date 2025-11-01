import { useDataContext } from "@/context";
import { DataTable } from "@/components/data-table/DataTable";
import { columns as defaultColumns, CreateDepartment } from "./utils";

const Department = () => {
  const { departments, userPermissions } = useDataContext();

  let columns = defaultColumns;
  let elements = [<CreateDepartment />];
  if (!userPermissions?.management?.employee_management.includes("create")) {
    elements = [];
  }

  return <DataTable data={departments} columns={columns} elements={elements} />;
};

export default Department;
