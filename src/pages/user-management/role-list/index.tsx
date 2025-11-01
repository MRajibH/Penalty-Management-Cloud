import { useDataContext } from "@/context";
import { columns, CreateRole } from "./utils";
import { DataTable } from "@/components/data-table/DataTable";

const RoleList = () => {
  const { roles, userPermissions } = useDataContext();

  let elements = [<CreateRole />];
  if (!userPermissions?.management?.users_management.includes("create")) {
    elements = [];
  }
  return <DataTable data={roles} columns={columns} elements={elements} />;
};

export default RoleList;
