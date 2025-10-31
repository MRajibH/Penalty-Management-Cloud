import { DataTable } from "@/components/data-table/DataTable";
import { useAuthContext, useDataContext } from "@/context";
import { columns, CreateRole } from "./utils";

const RoleList = () => {
  const { currentUser } = useAuthContext();
  const { roles } = useDataContext();

  let elements = [<CreateRole />];

  return <DataTable data={roles} columns={columns} elements={elements} />;
};

export default RoleList;
